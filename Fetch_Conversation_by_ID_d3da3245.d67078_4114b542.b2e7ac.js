var getGlobal = (global.get ? global.get : (context.global && context.global.get ? context.global.get.bind(context.global) : null));
if (!getGlobal) { node.error("Global context not available."); return msg; }
var requireGlobal = getGlobal('require');
if (!requireGlobal) { node.error("Global 'require' not exposed."); return msg; }
const cp   = requireGlobal('child_process');

const curr = getGlobal('currentEnvironment') || 'qa';
const cfg  = getGlobal('environmentConfig') || { dbPath: '/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_qa.sqlite' };

function runSql(args){ try { return cp.execFileSync('sqlite3', args, {encoding:'utf8', timeout:5000}).toString(); } catch(e){ node.warn("sqlite3 error: " + e.message); return ''; } }
function sqlQuote(v){ return "'" + String(v).replace(/'/g,"''") + "'"; }

var q = (msg && msg.req && msg.req.query) ? msg.req.query : {};
var id = q.id;
if (!id) { msg.statusCode=400; msg.payload={success:false,error:'id required'}; return msg; }

var out = runSql(['-readonly', cfg.dbPath, "SELECT hex(json) FROM conversation_details WHERE id = " + sqlQuote(id) + " LIMIT 1"]).trim();
if (!out){ msg.statusCode=404; msg.payload={ success:false, error:'conversation not found', id:id, environment:curr }; return msg; }

var obj={};
try { obj = JSON.parse(Buffer.from(out,'hex').toString('utf8')); } catch(e){ obj={}; }
var chat = Array.isArray(obj.chat_history) ? obj.chat_history : [];

msg.payload = { success:true, environment:curr, conversation:{ id, chat_history: chat, raw: obj } };
return msg;