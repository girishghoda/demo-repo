// Create tables if DB missing
const requireGlobal = context.global.get('require');
const cp = requireGlobal('child_process');
const fs = requireGlobal('fs');

const curr = global.get('currentEnvironment') || 'qa';
const cfg  = global.get('environmentConfig') || { apiUrl: 'https://ccpservices-qa.ulta.lcl', dbPath: '/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_qa.sqlite' };

function safe(cmd){
  try { return cp.execSync(cmd, {encoding:'utf8', timeout:5000}).toString(); }
  catch(e){ return ''; }
}

if (!fs.existsSync(cfg.dbPath)) {
  const sql =
    "CREATE TABLE conversation_ids(id TEXT PRIMARY KEY,date TEXT,timestamp TEXT,source TEXT DEFAULT '" + curr + "',synced_at TEXT DEFAULT(datetime('now')));" +
    "CREATE INDEX idx_conv_date ON conversation_ids(date);" +
    "CREATE TABLE conversation_details(id TEXT PRIMARY KEY,date TEXT,json TEXT,synced_at TEXT DEFAULT(datetime('now')));" +
    "CREATE INDEX idx_details_date ON conversation_details(date);" +
    "CREATE TABLE conversation_analysis(id TEXT PRIMARY KEY,date TEXT,feedback TEXT,used_skus TEXT,analysis TEXT,analyzed_at TEXT DEFAULT(datetime('now')));" +
    "CREATE INDEX idx_analysis_date ON conversation_analysis(date);" +
    "CREATE TABLE analysis_summary(cache_key TEXT PRIMARY KEY,start_date TEXT,end_date TEXT,limit_count INTEGER,kpi_data TEXT,analysis_data TEXT,created_at TEXT DEFAULT(datetime('now')),expires_at TEXT DEFAULT(datetime('now','+1 hour')));" +
    "CREATE INDEX idx_summary_dates ON analysis_summary(start_date,end_date);" +
    "CREATE INDEX idx_summary_expires ON analysis_summary(expires_at);" +
    "CREATE TABLE sync_status(id INTEGER PRIMARY KEY,environment TEXT,last_sync_date TEXT,total_conversations INTEGER DEFAULT 0,updated_at TEXT DEFAULT(datetime('now')));";
  safe("sqlite3 '" + cfg.dbPath + "' \"" + sql + "\"");
}

const body = msg.payload || {};
const startDate = (body.startDate && /\d{4}-\d{2}-\d{2}/.test(body.startDate)) ? body.startDate : '2025-01-01';
const endDate   = (body.endDate   && /\d{4}-\d{2}-\d{2}/.test(body.endDate))   ? body.endDate   : new Date().toISOString().split('T')[0];

msg.payload = { success:true, action:'sync', environment:curr, syncStartDate:startDate, syncEndDate:endDate, message:"Sync ready for " + curr + ": " + startDate + " to " + endDate };
return msg;