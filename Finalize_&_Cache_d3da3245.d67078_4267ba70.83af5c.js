const analyses = msg.analysisResults || [];
let pc=0, nc=0;
for (const a of analyses){ if (a.feedback==='positive') pc++; if (a.feedback==='negative') nc++; }

const kpis = {
  avgConversationLength: (analyses.length>0) ? Math.round(analyses.reduce((sum,a)=>sum + (a.chat_history ? a.chat_history.length : 3),0)/analyses.length) : 0,
  skuMentionRate: (analyses.length>0) ? Math.round((analyses.filter(a=> (a.used_skus||[]).length>0).length/analyses.length)*100) : 0,
  brandAnalysis: {},
  priceRangeAnalysis: {'0-20':0,'21-50':0,'51-100':0,'100+':0}
};

for (const a of analyses){
  for (const sku of (a.used_skus||[])){
    if (!kpis.brandAnalysis[sku.brand]) kpis.brandAnalysis[sku.brand] = {positive:0,negative:0,total:0};
    kpis.brandAnalysis[sku.brand].total++;
    if (a.feedback==='positive') kpis.brandAnalysis[sku.brand].positive++;
    if (a.feedback==='negative') kpis.brandAnalysis[sku.brand].negative++;
  }
}

msg.payload = {
  success: true,
  environment: global.get('currentEnvironment') || 'qa',
  counts: { positive: pc, negative: nc, total: analyses.length },
  analyses,
  enhancedKPIs: kpis,
  dateRange: { startDate: msg.startDate, endDate: msg.endDate }
};
return msg;