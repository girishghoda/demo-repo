// Load analyzed rows if available; avoid per-request LLM calls
const requireGlobal = context.global.get('require');
const cp = requireGlobal('child_process');
const fs = requireGlobal('fs');

const curr = global.get('currentEnvironment') || 'qa';
const cfg  = global.get('environmentConfig') || {};

function sqliteArgs(args){
  try {
    return cp.execFileSync('sqlite3', args, {encoding:'utf8', timeout:8000}).toString();
  } catch(e){ return ''; }
}

const q = (msg && msg.req && msg.req.query) ? msg.req.query : {};
const end  = q.endDate   ? new Date(q.endDate)   : new Date();
const start= q.startDate ? new Date(q.startDate) : new Date(end.getTime()-7*24*60*60*1000);
msg.startDate = start.toISOString().split('T')[0];
msg.endDate   = end.toISOString().split('T')[0];
msg.max = Math.max(1, Math.min(Number(q.limit||20), 100));

if (!cfg.dbPath || !fs.existsSync(cfg.dbPath)) {
  msg.payload = { success:true, environment:curr, message:'No database found; run ingest first', analyses:[], counts:{positive:0,negative:0,total:0} };
  return msg;
}

// Try to read existing analyses from conversation_analysis
const sep='|~|';
const sql = [
  "SELECT id, date, feedback, analysis_json, used_skus_json",
  "FROM conversation_analysis",
  "WHERE date>=? AND date<=?",
  "ORDER BY date DESC",
  "LIMIT ?"
].join(" ");

const out = sqliteArgs(['-readonly','-separator',sep, cfg.dbPath, sql, msg.startDate, msg.endDate, String(msg.max)]);
node.warn(out);
const analyses = [];
if (out){
  const lines = out.trim().split('\n');
  for (const ln of lines){
    const parts = ln.split(sep);
    if (parts.length < 5) continue;
    const id = parts[0], date = parts[1], fb = parts[2];
    let analysis = null, used = [];
    try { analysis = JSON.parse(parts[3] || "{}"); } catch(e){ analysis = null; }
    try { used = JSON.parse(parts[4] || "[]"); } catch(e){ used = []; }
    analyses.push({ id, date, feedback: fb || 'none', analysis, used_skus: Array.isArray(used)?used:[] });
  }
}

if (analyses.length > 0) {
  // We already have analyzed data; skip LLM loop
  msg.conversations = [];
  msg.skuData = {};
  msg.currentIndex = 0;
  msg.analysisResults = analyses;
  return msg;
}

// Fallback: if no prior analyses, do the old path (minimal window) which will call LLM once per conversation
let skus={ '2546071':{sku:'2546071',name:'Airbrush Placement Shadow Brush',price:'14.5',brand:'IT BRUSHES FOR ULTA'},
           '2555575':{sku:'2555575',name:'Flawless Dermaplane Travel Pack',price:'5.99',brand:'FLAWLESS BY FINISHING TOUCH'},
           '2576318':{sku:'2576318',name:'Nourishing Hand Wash',price:'48.0',brand:'OUAI'} };

const sql2 = [
  "SELECT id, date, json",
  "FROM conversation_details",
  "WHERE (json LIKE '%👎%' OR json LIKE '%👍%') AND date>=? AND date<=?",
  "ORDER BY date DESC",
  "LIMIT ?"
].join(" ");
const out2 = sqliteArgs(['-readonly','-separator',sep, cfg.dbPath, sql2, msg.startDate, msg.endDate, String(msg.max)]);
node.warn(out2);
const convs=[];
if (out2){
  const lines = out2.trim().split('\n');
  for (const ln of lines){
    const parts = ln.split(sep);
    if (parts.length<3) continue;
    const id = parts[0];
    const date = parts[1];
    const jtxt = parts.slice(2).join(sep);
    try {
      const obj = JSON.parse(jtxt);
      const chat = Array.isArray(obj.chat_history) ? obj.chat_history : [];
      let fb='none';
      for (const m of chat){
        if (m && typeof m.content === 'string' && m.content.indexOf('👎')>=0){ fb='negative'; break; }
        if (m && typeof m.content === 'string' && m.content.indexOf('👍')>=0){ fb='positive'; break; }
      }
      const content = chat.map(m => (m&&m.content)||'').join(' ');
      const matches = content.match(/\b\d{6,8}\b/g) || [];
      const used=[];
      for (const s of matches){ if (skus[s]) used.push(skus[s]); }
      convs.push({ id, date, feedback: fb, chat_history: chat, used_skus: used });
    } catch(e){}
  }
}

msg.conversations = convs;
msg.skuData = skus;
msg.currentIndex = 0;
msg.analysisResults = [];
node.warn(msg);
return msg;
