// 2-output: [skip HTTP (got IDs locally), call backend]
const requireGlobal = context.global.get('require');
const cp = requireGlobal('child_process');
const curr = global.get('currentEnvironment') || 'qa';
const cfg = global.get('environmentConfig') || { apiUrl:'https://ccpservices-qa.ulta.lcl', dbPath:'/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_qa.sqlite' };
function safe(c){ try { return cp.execSync(c,{encoding:'utf8',timeout:5000}).toString(); } catch(e){ return ''; } }

let body = msg.payload || {};
let startDate = body.startDate;
let endDate = body.endDate;

if (!startDate || !/\d{4}-\d{2}-\d{2}/.test(startDate)) {
  const last = safe("sqlite3 -readonly '" + cfg.dbPath + "' \"SELECT last_sync_date FROM sync_status WHERE environment='" + curr + "' ORDER BY updated_at DESC LIMIT 1\"").trim();
  startDate = last || '2025-01-01';
}
if (!endDate || !/\d{4}-\d{2}-\d{2}/.test(endDate)) {
  endDate = new Date().toISOString().split('T')[0];
}

msg.ingest = { startDate, endDate, processed:0, stored:0, analyzed:0, ids:[], index:0 };

// Try DB first
const sep='|~|';
const local = safe("sqlite3 -readonly '" + cfg.dbPath + "' -separator '" + sep + "' \"SELECT id FROM conversation_ids WHERE date>='" + startDate + "' AND date<='" + endDate + "' ORDER BY date DESC\"");
node.warn(local);
if (local && local.trim()){
  const ids = local.trim().split('\n').map(s=>s.split(sep)[0]).filter(Boolean);
  msg.ingest.ids = ids;
  msg.ingest.index = 0;
  node.warn("not going out");
  node.warn(msg);
  return [msg, null];
}

// Else prepare HTTP
msg.url = cfg.apiUrl.replace(/\/$/,'') + '/innovation/api/ccp/v1/interplay-conv-ai-lab/feedback/conversation-ids';
msg.method='POST';
msg.headers = {};
msg.headers = Object.assign({}, msg.headers, {"Content-Type":"application/json"});
try{
  const env = requireGlobal('process').env || {};
  const apiKey = env.ULTA_API_KEY || (global.get('ultaApiKey') || '');
  const bearer = env.ULTA_API_BEARER || (global.get('ultaApiBearer') || '');
  if (apiKey) msg.headers['x-api-key'] = apiKey;
  if (bearer) msg.headers['Authorization'] = 'Bearer ' + bearer;
}catch(e){}
msg.rejectUnauthorized=false;
msg.payload={
  date_filter_type:"Calendar Range",
  feedback_filter:"All",
  timezone:"CDT",
  limit_enabled:false,
  limit_number:1000,
  calendar_start_date:startDate,
  calendar_end_date:endDate
};
node.warn("going out");
node.warn(msg);
return [null, msg];