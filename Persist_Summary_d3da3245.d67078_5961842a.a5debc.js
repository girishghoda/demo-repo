var requireGlobal = context.global.get('require');
var cp = requireGlobal('child_process');
var cfg = global.get('environmentConfig') || {};
var p = msg.payload || {};
if (!cfg.dbPath) return msg;

try {
  var kpi = JSON.stringify(p.enhancedKPIs || {} ).replace(/'/g,"''");
  var analyses = JSON.stringify(p.analyses || [] ).replace(/'/g,"''");
  var start = (msg.startDate||'').slice(0,10);
  var end   = (msg.endDate||'').slice(0,10);
  var limit = (msg.max||100);
  var cacheKey = ("v1:"+start+":"+end+":"+limit).replace(/'/g,"''");

  var sql = "INSERT OR REPLACE INTO analysis_summary " +
            "(cache_key,start_date,end_date,limit_count,kpi_data,analysis_data,created_at,expires_at) " +
            "VALUES ('"+cacheKey+"','"+start+"','"+end+"',"+limit+",'"+kpi+"','"+analyses+"',datetime('now'),datetime('now','+1 day'))";
  cp.execFileSync('sqlite3', [cfg.dbPath, sql], {encoding:'utf8', timeout:3000});
} catch(e){ node.warn('persist summary failed: '+e.message); }
return msg;
