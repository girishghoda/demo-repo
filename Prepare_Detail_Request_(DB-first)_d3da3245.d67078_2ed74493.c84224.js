function safeForServer(s){
  s = String(s == null ? '' : s);
  s = s.replace(/\r\n/g, '\n');
  s = s.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '').replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
  s = s.replace(/\\(?![\\\/"bfnrtu])/g, '\\\\');
  if (s.length > 8000) s = s.slice(0, 8000);
  return s;
}

function csvParse(text){
  var rows = [];
  var i = 0, len = text.length, field = '', row = [], inQuotes = false;
  while (i < len){
    var ch = text[i];
    if (inQuotes){
      if (ch === '"'){
        if (i+1 < len && text[i+1] === '"'){ field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += ch; i++; continue;
    } else {
      if (ch === '"'){ inQuotes = true; i++; continue; }
      if (ch === ','){ row.push(field); field=''; i++; continue; }
      if (ch === '\n'){ row.push(field); rows.push(row); row=[]; field=''; i++; continue; }
      if (ch === '\r'){ i++; continue; }
      field += ch; i++; continue;
    }
  }
  row.push(field); rows.push(row);
  return rows;
}

function loadCatalog(){
  var cfg = global.get('environmentConfig') || {};
  var path = cfg.catalogPath || '/Users/Arul329/Downloads/ulta_conv_ai/ulta_product_catalog.csv';
  var requireGlobal = context.global.get('require');
  var fs = requireGlobal('fs');
  var stat = null;
  try{ stat = fs.statSync(path); } catch(e){ return { map:{}, headers:[] }; }

  var cache = global.get('ultaCatalog') || null;
  if (cache && cache.mtime === String(stat.mtimeMs)){ return cache; }

  var txt = '';
  try{ txt = fs.readFileSync(path, 'utf8'); } catch(e){ return { map:{}, headers:[] }; }

  var rows = csvParse(txt);
  if (!rows.length) return { map:{}, headers:[] };
  var headers = rows[0].map(function(h){ return String(h||'').trim(); });
  var idx = { sku: headers.indexOf('sku'), name: headers.indexOf('name'), brand: headers.indexOf('brand'), price: headers.indexOf('price'), category: headers.indexOf('category') };
  var map = {};
  for (var r=1; r<rows.length; r++){
    var row = rows[r];
    var sku = String(row[idx.sku]||'').trim();
    if (!sku) continue;
    map[sku] = {
      sku: sku,
      name: String(row[idx.name]||'').trim(),
      brand: String(row[idx.brand]||'').trim(),
      price: String(row[idx.price]||'').trim(),
      category: String(row[idx.category]||'').trim()
    };
  }
  var out = { mtime: String(stat.mtimeMs), map: map, headers: headers };
  global.set('ultaCatalog', out);
  return out;
}

function extractSkusFromChat(chat){
  var set = {};
  for (var i=0;i<chat.length;i++){
    var c = String((chat[i]&&chat[i].content)||'');
    var matches = c.match(/\b\d{6,8}\b/g) || [];
    for (var j=0;j<matches.length;j++){ set[matches[j]] = true; }
  }
  return Object.keys(set);
}

function buildProductContext(skucodes, catalogMap){
  var lines = [];
  var used = [];
  for (var i=0;i<skucodes.length;i++){
    var code = skucodes[i];
    var p = catalogMap[code];
    if (p){
      used.push(p);
      var line = '- SKU ' + p.sku + ': ' + (p.name||'') + ' by ' + (p.brand||'') + (p.price?(' ($'+p.price+')'):'') + (p.category?(' ['+p.category+']'):'') ;
      lines.push(line);
    }
  }
  return { text: lines.length ? lines.join('\n') : 'No specific products mentioned', used: used };
}

var requireGlobal = context.global.get('require');
var cp = requireGlobal('child_process');

// Resolve config
var cfg = global.get('environmentConfig') || {};
if (!cfg.apiUrl) cfg.apiUrl = 'https://ccpservices-qa.ulta.lcl';
if (!cfg.dbPath) cfg.dbPath = '/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_qa.sqlite';
node.warn(msg);
// Inputs
var id = msg.detailId;
if (!id) { 
  // fail-safe: advance and return to loop to avoid spinning
  if (msg.ingest) msg.ingest.index++;
  return [msg, null, null]; 
}

// Helpers
function q(v){ return "'" + String(v).replace(/'/g, "''") + "'"; }
function sqlOne(sql) {
  try {
    var out = cp.execFileSync('sqlite3', [cfg.dbPath, sql], {encoding:'utf8', timeout:3000}).trim();
    return out || '';
  } catch { return ''; }
}

function getJsonStrById(id) {
  const idQ = "'" + String(id).replace(/'/g, "''") + "'";
  // Fetch raw text first
  const raw = sqlOne(`SELECT json FROM conversation_details WHERE id=${idQ} LIMIT 1`);
  if (!raw) return null;

  // If the DB happened to store hex (legacy runs), decode it.
  // A pure-hex string of even length is a good heuristic.
  const looksHex = /^[0-9A-F]+$/i.test(raw) && (raw.length % 2 === 0);
  if (looksHex) {
    try { return Buffer.from(raw, 'hex').toString('utf8'); } catch { /* fall through */ }
  }
  return raw;
}

// ... later:


// 1) Check if we already have details in DB
var idQ = q(id);
//var hex = sqlOne(`SELECT hex(json) FROM conversation_details WHERE id=${idQ} LIMIT 1`);
var jsonStr = getJsonStrById(id);

//node.warn(hex + " : " + idQ);
if (jsonStr) {
  // If analysis exists, advance and return to loop
  var haveAnalysis = !!sqlOne(`SELECT 1 FROM conversation_analysis WHERE id=${idQ} LIMIT 1`);
  if (haveAnalysis) {
    if (msg.ingest) msg.ingest.index++;
    return [msg, null, null];
  }

  // No analysis yet. Build LLM request if the chat has feedback; else skip.
  //var jsonStr = Buffer.from(hex, 'hex').toString('utf8');
  var obj = {};
  try { obj = JSON.parse(jsonStr); } catch {}
  var chat = Array.isArray(obj.chat_history) ? obj.chat_history : [];
  var feedback = 'none';
  for (var i=0;i<chat.length;i++){
    var c = (chat[i] && chat[i].content) || '';
    if (c.indexOf('👎')!==-1){ feedback='negative'; break; }
    if (c.indexOf('👍')!==-1){ feedback='positive'; break; }
  }
  if (feedback === 'none') { 
    if (msg.ingest) msg.ingest.index++;
    return [msg, null, null]; 
  }

  // Build product context from catalog
  var catalog = loadCatalog();
  var skus = extractSkusFromChat(chat);
  var ctx = buildProductContext(skus, catalog.map);

  function normRole(r){ return (r === 'assistant') ? 'assistant' : 'user'; }
  var messages = [];
  var systemPrompt = 'You are an expert customer service analyst for Ulta Beauty. Analyze the following conversation and provide insights.\n\n' +
    'Product Context:\n' + ctx.text + '\n\n' +
    'Focus on: what likely influenced the customer feedback (positive/negative), product fit, price/value, and guidance for a better outcome.\n' +
    'Return only a compact JSON object with keys: reason, priority, recommendations, sentiment_score, category.';
  messages.push({ role: 'system', content: safeForServer(systemPrompt) });
  for (var j=0;j<chat.length;j++){
    var txt = safeForServer(chat[j] && chat[j].content != null ? chat[j].content : '');
    messages.push({ role: normRole(chat[j].role), content: safeForServer(txt) });
  }
  var fb = feedback==='negative' ? 'Negative 👎' : 'Positive 👍';
  var finalInstr = 'Given the conversation above, produce the JSON. Feedback: ' + fb + '. JSON only, no prose.';
  messages.push({ role: 'user', content: safeForServer(finalInstr) });

  msg.llmPayload = { model:'gpt-4o-mini', messages: messages, temperature:0.3, max_tokens: 800 };
  msg.payload = msg.llmPayload;
  msg.headers = {};
  msg.currentConv = { id: id, date: (obj.date||'').slice(0,10), feedback: feedback, used_skus: ctx.used };

  try {
    var key = (requireGlobal('process').env.ULTA_LLM_KEY || global.get('llmKey') || '');
    msg.headers = Object.assign({}, msg.headers, {
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  } catch {}
  msg.rejectUnauthorized = false;

  // Send to LLM (output 1)
  return [null, msg, null];
}

// 2) DB MISS -> configure backend request (critical)
var apiUrl = cfg.apiUrl || 'https://ccpservices-qa.ulta.lcl';
msg.url = apiUrl.replace(/\/$/,'') + '/innovation/api/ccp/v1/interplay-conv-ai-lab/feedback/conversation-details';
msg.method = 'POST';
msg.headers = {};
msg.headers = Object.assign({}, msg.headers, {'Content-Type':'application/json'});

// Optional: add keys/bearer if present in globals/env
try {
  var env = requireGlobal('process').env || {};
  var apiKey = env.ULTA_API_KEY || (global.get('ultaApiKey') || '');
  var bearer = env.ULTA_API_BEARER || (global.get('ultaApiBearer') || '');
  if (apiKey) msg.headers['x-api-key'] = apiKey;
  if (bearer) msg.headers['Authorization'] = 'Bearer ' + bearer;
} catch {}

msg.rejectUnauthorized = false;

// Backend payload. If your API needs date range, uncomment:
msg.payload = {
  conversation_id: id
  // , startDate: msg.ingest && msg.ingest.startDate
  // , endDate:   msg.ingest && msg.ingest.endDate
};
node.warn(msg);
// No spammy warn here; just route to backend (output 2)
return [null, null, msg];
