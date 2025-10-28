const requireGlobal=context.global.get('require');
const cp=requireGlobal('child_process');
const cfg=global.get('environmentConfig')||{dbPath:'/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_qa.sqlite'};
function safe(c){try{return cp.execSync(c,{encoding:'utf8',timeout:5000}).toString();}catch(e){return ''}}

let ids = [];
if (msg.payload && Array.isArray(msg.payload.conversation_ids)) {
  ids = msg.payload.conversation_ids.map(x => (typeof x==="string" ? x.split(" ")[0].split(":")[0] : x));
} else if (msg.ingest && Array.isArray(msg.ingest.ids) && msg.ingest.ids.length) {
  ids = msg.ingest.ids;
}
ids = ids.filter(Boolean);

// persist into conversation_ids (use startDate as date tag)
const d0 = (msg.ingest && msg.ingest.startDate) ? msg.ingest.startDate : new Date().toISOString().slice(0,10);
for (const id of ids){
  const idEsc = String(id).replace(/'/g,"''");
  const sql = "INSERT OR IGNORE INTO conversation_ids(id,date) VALUES('" + idEsc + "','" + d0 + "')";
  try { cp.execFileSync('sqlite3',[cfg.dbPath, sql], {encoding:'utf8',timeout:3000}); } catch(e){}
}

msg.ingest.ids = ids;
msg.ingest.index = 0;
node.warn(msg);
return msg;