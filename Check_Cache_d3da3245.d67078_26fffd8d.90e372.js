// Cache-first: if analysis_summary has a fresh record, return it immediately.
var requireGlobal = context.global.get('require');
var cp = requireGlobal('child_process');
var cfg = global.get('environmentConfig') || {};
var q = (msg && msg.req && msg.req.query) ? msg.req.query : {};
var start = (q.startDate || '').slice(0,10);
var end   = (q.endDate   || '').slice(0,10);
var limit = Math.max(1, Math.min(parseInt(q.limit||100,10), 100));
var cacheKey = ("v1:"+start+":"+end+":"+limit);

function sqlite(args){ try { return cp.execFileSync('sqlite3', args, {encoding:'utf8', timeout:3000}).toString(); } catch(e){ return ''; } }
node.warn(cfg);

if (!cfg.dbPath) { return [msg, null]; }
var row = sqlite([cfg.dbPath, "SELECT kpi_data, analysis_data FROM analysis_summary WHERE cache_key='"+cacheKey.replace(/'/g,"''")+"' AND coalesce(expires_at, datetime('now')) > datetime('now') LIMIT 1"]);
node.warn(row);
if (row && row.trim()) {
  try {
    // sqlite3 without -json; split by default pipe if present, else parse as JSON tuple
    var parts = row.trim().split("\n").slice(-1)[0].split("|");
    var kpi = JSON.parse(parts[0]);
    var analyses = JSON.parse(parts[1] || "[]");
    msg.payload = { success:true, enhancedKPIs:kpi, analyses:analyses, dateRange:{startDate:start, endDate:end} };
    return [null, msg];
  } catch(e){ /* miss -> continue */ }
}
return [msg, null];
