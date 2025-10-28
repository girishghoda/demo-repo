// Quick KPI counts
const requireGlobal = context.global.get('require');
const cp = requireGlobal('child_process');
const curr = global.get('currentEnvironment') || 'qa';
const cfg  = global.get('environmentConfig') || { dbPath:'/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_qa.sqlite' };

function safe(cmd){ try { return cp.execSync(cmd,{encoding:'utf8',timeout:5000}).toString(); } catch(e){ return ''; } }

const q = (msg && msg.req && msg.req.query) ? msg.req.query : {};
const start = q.startDate || new Date(Date.now()-7*24*60*60*1000).toISOString().split('T')[0];
const end   = q.endDate   || new Date().toISOString().split('T')[0];

const total    = parseInt((safe("sqlite3 -readonly '" + cfg.dbPath + "' \"SELECT COUNT(*) FROM conversation_details WHERE date>='" + start + "' AND date<='" + end + "'\"").trim()) || '0',10);
const positive = parseInt((safe("sqlite3 -readonly '" + cfg.dbPath + "' \"SELECT COUNT(*) FROM conversation_details WHERE date>='" + start + "' AND date<='" + end + "' AND json LIKE '%👍%'\"").trim()) || '0',10);
const negative = parseInt((safe("sqlite3 -readonly '" + cfg.dbPath + "' \"SELECT COUNT(*) FROM conversation_details WHERE date>='" + start + "' AND date<='" + end + "' AND json LIKE '%👎%'\"").trim()) || '0',10);

msg.payload = { success:true, environment:curr, dateRange:{ startDate:start, endDate:end }, counts:{ total, positive, negative } };
return msg;