var getGlobal = (global.get ? global.get : (context.global && context.global.get ? context.global.get.bind(context.global) : null));
if (!getGlobal) { node.error("Global context not available."); return msg; }
var requireGlobal = getGlobal('require');
if (!requireGlobal) { node.error("Global 'require' not exposed."); return msg; }
const cp = requireGlobal('child_process');

const curr = (getGlobal('currentEnvironment') || 'qa');
const cfg  = (getGlobal('environmentConfig') || { dbPath: '/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_qa.sqlite' });

const ingest = (msg && msg.ingest) ? msg.ingest : {};
const startDate = ingest.startDate || '';
const endDate   = ingest.endDate || '';
const idsLen    = Array.isArray(ingest.ids) ? ingest.ids.length : 0;
const lastSyncDate = endDate || startDate || '';

function sqlQuote(v){ return "'" + String(v).replace(/'/g,"''") + "'"; }
function sqlite(args){
  try { return cp.execFileSync('sqlite3', args, {encoding:'utf8', timeout:5000}).toString(); }
  catch(e){ node.warn("sqlite3 error: " + e.message); return ''; }
}

sqlite([cfg.dbPath, "CREATE TABLE IF NOT EXISTS sync_status (id INTEGER PRIMARY KEY, environment TEXT, last_sync_date TEXT, total_conversations INTEGER, updated_at TEXT)"]);

const sql = "INSERT OR REPLACE INTO sync_status (id, environment, last_sync_date, total_conversations, updated_at) VALUES (1, " + sqlQuote(curr) + ", " + sqlQuote(lastSyncDate) + ", " + idsLen + ", datetime('now'))";
sqlite([cfg.dbPath, sql]);

msg.payload = {
  success: true,
  environment: curr,
  message: "Ingest complete",
  summary: {
    dateRange: { start: startDate, end: endDate },
    ids: idsLen,
    stored: ingest.stored || 0,
    analyzed: ingest.analyzed || 0
  }
};
return msg;