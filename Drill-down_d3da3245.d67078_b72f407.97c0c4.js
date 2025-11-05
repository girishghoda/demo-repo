// Paged list using hex(json) for safe parsing
var getGlobal = (global.get ? global.get : (context.global && context.global.get ? context.global.get.bind(context.global) : null));
if (!getGlobal) { node.error("Global context not available."); return msg; }
var requireGlobal = getGlobal('require');
if (!requireGlobal) { node.error("Global 'require' not exposed."); return msg; }
const cp = requireGlobal('child_process');

const curr = getGlobal('currentEnvironment') || 'qa';
const cfg  = getGlobal('environmentConfig') || { dbPath: '/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_qa.sqlite' };

function runSql(args){
  try { return cp.execFileSync('sqlite3', args, {encoding:'utf8', timeout:5000}).toString(); }
  catch(e){ node.warn("sqlite3 error: " + e.message); return ''; }
}
function sqlQuote(v){ return "'" + String(v).replace(/'/g, "''") + "'"; }

var q = (msg && msg.req && msg.req.query) ? msg.req.query : {};
var feedback  = q.feedback || undefined;
var startDate = q.startDate || '';
var endDate   = q.endDate || '';
var page      = parseInt(q.page,10);  if(!Number.isFinite(page)||page<1) page=1;
var limit     = parseInt(q.limit,10); if(!Number.isFinite(limit)||limit<1) limit=20;
if (limit>200) limit=200;
var offset    = (page-1)*limit;

var where = "WHERE 1=1";
if (feedback==='positive') where += " AND json LIKE '%👍%'";
else if (feedback==='negative') where += " AND json LIKE '%👎%'";

if (startDate) where += " AND date >= " + sqlQuote(startDate);
if (endDate)   where += " AND date <= " + sqlQuote(endDate);

var cntRaw = runSql(['-readonly', cfg.dbPath, "SELECT COUNT(*) FROM conversation_details " + where]).trim();
var total = parseInt(cntRaw||'0',10); if(!Number.isFinite(total)) total=0;

var sep = '|~|';
var dataSql =
  "SELECT id, date, hex(json) AS json_hex, substr(json,1,500) AS preview " +
  "FROM conversation_details " + where + " " +
  "ORDER BY date DESC " +
  "LIMIT " + limit + " OFFSET " + offset;

var out = runSql(['-readonly', cfg.dbPath, '-separator', sep, dataSql]);
var convs = [];
if (out) {
  var lines = out.trim().split('\n');
  for (var i=0;i<lines.length;i++){
    var parts = lines[i].split(sep);
    if (parts.length>=4){
      var id   = parts[0];
      var date = parts[1];
      var jhex = parts[2]||'';
      var preview = parts[3]||'';
      var obj = null;
      try { obj = JSON.parse(Buffer.from(jhex,'hex').toString('utf8')); } catch(e){}
      var chat = (obj&&Array.isArray(obj.chat_history)) ? obj.chat_history : [];
      var fb = 'none';
      for (var k=0;k<chat.length;k++){
        var c = (chat[k]&&chat[k].content)||'';
        if (c.indexOf('👎')!==-1){ fb='negative'; break; }
        if (c.indexOf('👍')!==-1){ fb='positive'; break; }
      }
      convs.push({ id, date, preview, chat_history: chat, feedback: fb });
    }
  }
}

msg.payload = {
  success: true,
  environment: curr,
  conversations: convs,
  pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total/Math.max(1,limit))) },
  filters: { feedback, startDate, endDate }
};
return msg;