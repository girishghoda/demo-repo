// Store Detail + Maybe LLM (shell-only, hardened) — stable id, stdin SQL, verified insert

var requireGlobal = context.global.get('require');
var cp   = requireGlobal('child_process');
var fs   = requireGlobal('fs');
var path = requireGlobal('path');
var os   = requireGlobal('os');

function resolveDbPath() {
  if (process.env.INTERPLAY_DB && fs.existsSync(process.env.INTERPLAY_DB)) return process.env.INTERPLAY_DB;
  var candidates = [
    '/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_qa.sqlite',
    path.join(process.cwd(), 'DATA', 'ulta_conv_ai_qa.sqlite'),
    '/interplay_v2/DATA/ulta_conv_ai_qa.sqlite',
    path.join(os.homedir(), 'InterplayApp', 'interplay_v2', 'DATA', 'ulta_conv_ai_qa.sqlite')
  ];
  for (var c of candidates) { try { if (fs.existsSync(c)) return c; } catch(e){} }
  var dir = path.join(process.cwd(), 'DATA'); try { fs.mkdirSync(dir, {recursive:true}); } catch(e){}
  return path.join(dir, 'ulta_conv_ai_qa.sqlite');
}

var cfg = global.get('environmentConfig') || {};
if (!cfg.dbPath) {
  cfg.dbPath = resolveDbPath();
  cfg.environment = cfg.environment || (process.env.INTERPLAY_ENV || 'qa');
  global.set('environmentConfig', cfg);
}

function escSQL(s){
  // Escape single quotes for SQL literals
  return String(s == null ? '' : s).replace(/'/g, "''");
}
function toObject(x) {
  if (!x) return {};
  if (typeof x === 'string') {
    try { return JSON.parse(x); } catch { return {}; }
  }
  return x;
}
function extractChat(body) {
  if (Array.isArray(body.chat_history)) return body.chat_history;
  if (body.conversation_detail && Array.isArray(body.conversation_detail.chat_history)) {
    return body.conversation_detail.chat_history;
  }
  return [];
}

// 1) Validate id
if (!msg.detailId || !String(msg.detailId).trim()) {
  node.warn('[Store Detail] Missing/empty msg.detailId; skipping to avoid loop.');
  if (msg.ingest) msg.ingest.index++;
  return msg;
}
var id = String(msg.detailId).trim();
var dateISO = new Date().toISOString().slice(0,19).replace('T',' ');

// 2) Normalize payload and build compact JSON doc
var body = toObject(msg.payload);
var chat = extractChat(body);
var jsonDoc = JSON.stringify({ chat_history: chat });

// 3) Ensure table exists (stdin; no .parameter)
try {
  cp.execFileSync('sqlite3', ['-batch', cfg.dbPath], {
    input:
      "BEGIN;\n" +
      "CREATE TABLE IF NOT EXISTS conversation_details (\n" +
      "  id   TEXT PRIMARY KEY NOT NULL,\n" +
      "  date TEXT NOT NULL,\n" +
      "  json TEXT NOT NULL\n" +
      ");\n" +
      "COMMIT;\n",
    encoding: 'utf8',
    timeout: 8000
  });
} catch (e) {
  node.warn('[Store Detail] ensure table failed: ' + e.message);
  // Still continue; table may already exist
}

// 4) Upsert using a single stdin SQL script (reliable across sqlite versions)
try {
  var sql =
    "BEGIN;\n" +
    "INSERT OR REPLACE INTO conversation_details(id,date,json)\n" +
    "VALUES('" + escSQL(id) + "','" + escSQL(dateISO) + "','" + escSQL(jsonDoc) + "');\n" +
    "COMMIT;\n";
  cp.execFileSync('sqlite3', ['-batch', cfg.dbPath], {
    input: sql,
    encoding: 'utf8',
    timeout: 8000
  });

  // 5) Verify insert; if it failed for any reason, warn and still advance index to avoid spin
  var verify = cp.execFileSync('sqlite3', [cfg.dbPath,
    "SELECT id, length(json) FROM conversation_details WHERE id='" + escSQL(id) + "' LIMIT 1;"
  ], { encoding: 'utf8', timeout: 5000 }).trim();

  if (!verify) {
    node.warn('[Store Detail] VERIFY FAILED: no row for id=' + id);
  } else {
    // Optional: uncomment to see confirmation
    // node.warn('[Store Detail] inserted: ' + verify);
    if (msg.ingest) msg.ingest.stored = (msg.ingest.stored || 0) + 1;
  }

} catch (e) {
  node.warn('[Store Detail] upsert failed: ' + e.message + ' (id=' + id + ')');
  // Advance index anyway to avoid infinite loop
  if (msg.ingest) msg.ingest.index++;
  return msg;
}

// 6) Advance loop
if (msg.ingest) {
  msg.ingest.processed = (msg.ingest.processed || 0) + 1;
  msg.ingest.index++;
}

return msg;
