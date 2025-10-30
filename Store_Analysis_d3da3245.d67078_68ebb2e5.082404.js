const requireGlobal=context.global.get('require');
const cp=requireGlobal('child_process');
const cfg=global.get('environmentConfig')||{dbPath:'/Users/Arul329/InterplayApp/interplay_v2/DATA/ulta_conv_ai_qa.sqlite'};

function safe(c){ try { return cp.execSync(c,{encoding:'utf8',timeout:5000}).toString(); } catch(e){ return ''; } }

let analysis={reason:'Analysis failed',priority:'Medium',recommendations:['Review manually'],sentiment_score:0.5,category:'other'};
try {
  if (msg.payload && msg.payload.choices && msg.payload.choices[0]){
    const content=String(msg.payload.choices[0].message.content||'').trim();
    const m=content.match(/\{[\s\S]*\}/);
    if (m){ analysis = JSON.parse(m[0]); }
  } else if (msg.payload && msg.payload.error){
    node.warn("LLM error: " + (msg.payload.error.message || JSON.stringify(msg.payload.error)));
  }
} catch(e){}

const skusJson = JSON.stringify(msg.currentConv.used_skus||[]).replace(/'/g,"''");
const aJson    = JSON.stringify(analysis).replace(/'/g,"''");

safe("sqlite3 '" + cfg.dbPath + "' \"INSERT OR REPLACE INTO conversation_analysis(id,date,feedback,used_skus,analysis) VALUES('" + msg.currentConv.id + "','" + msg.currentConv.date + "','" + msg.currentConv.feedback + "','" + skusJson + "','" + aJson + "')\"");

msg.ingest.analyzed++;
msg.ingest.index++;
return msg;