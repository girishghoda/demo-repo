// Exit early if we’re out of conversations
if (!msg.conversations || typeof msg.currentIndex !== 'number' || msg.currentIndex >= msg.conversations.length) {
  return [msg, null];
}

const conv = msg.conversations[msg.currentIndex] || {};
const rawHistory = Array.isArray(conv.chat_history) ? conv.chat_history.slice(-40) : [];
const skuData = (msg.skuData && typeof msg.skuData === 'object') ? msg.skuData : {};

function normRole(r){
  const t = String(r || '').toLowerCase();
  return (t === 'assistant' || t === 'system' || t === 'user') ? t : 'user';
}

// Clean text so JSON.stringify can safely encode it.
function cleanText(s){
  s = String(s == null ? '' : s);
  // normalize CR to LF
  s = s.replace(/\r\n?/g, '\n');
  // strip ASCII control chars except tab/newline
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ');
  // remove JS line and paragraph separators
  s = s.replace(/[\u2028\u2029]/g, ' ');
  // strip unpaired surrogates
  s = s.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '')
       .replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
  // collapse excessive whitespace a bit
  s = s.replace(/[ \t]+/g, ' ');
  if (s.length > 8000) s = s.slice(0, 8000);
  return s;
}

function extractSkusFromChat(chat){
  const set = {};
  for (let i=0;i<chat.length;i++){
    const c = String((chat[i] && chat[i].content) || '');
    const matches = c.match(/\b\d{6,8}\b/g) || [];
    for (let j=0;j<matches.length;j++) set[matches[j]] = true;
  }
  return Object.keys(set);
}

function buildProductContext(skucodes, skuMap){
  const lines = [];
  const used = [];
  for (const code of skucodes){
    const p = skuMap[code];
    if (p){
      used.push(p);
      lines.push(`- SKU ${p.sku}: ${p.name} by ${p.brand}${p.price ? ` ($${p.price})` : ''}${p.category ? ` [${p.category}]` : ''}`);
    }
  }
  return { text: lines.length ? lines.join('\n') : 'No specific products mentioned', used };
}

// 1) Filter history: DROP assistant prose; keep only system + user
const history = rawHistory
  .filter(m => {
    const r = normRole(m.role);
    return r === 'system' || r === 'user';
  })
  .map(m => ({ role: normRole(m.role), content: cleanText(m.content) }));

const foundSkus = extractSkusFromChat(history);
const ctx = buildProductContext(foundSkus, skuData);

const systemPrompt = [
  'You are an expert customer service analyst for Ulta Beauty. Analyze the following conversation and provide insights.',
  '',
  'Product Context:',
  ctx.text,
  '',
  'Focus on: what likely influenced the customer feedback (positive/negative), product fit, price/value, and guidance for a better outcome.',
  'Return ONLY a compact JSON object with keys: reason, priority, recommendations, sentiment_score, category. No prose, no backticks, no prefix.'
].join('\n');

const messages = [
  { role: 'system', content: cleanText(systemPrompt) },
  ...history,
  { role: 'user', content: 'JSON only with keys reason, priority, recommendations, sentiment_score, category.' }
];

/*
// Build the payload as an object
const payloadObj = {
  model: msg.model || 'gpt-4o-mini',
  messages,
  temperature: 0.2,
  max_tokens: 500,
  // 2) Force JSON output where supported
  response_format: { type: 'json_object' }
  // 3) No stop needed
};

// Send object; Node-RED will JSON-stringify because of Content-Type
msg.llmPayload = payloadObj;
msg.payload = payloadObj;

try{
  const requireGlobal = context.global.get('require');
  const key = (requireGlobal('process').env.ULTA_LLM_KEY || global.get('llmKey') || '');
  msg.headers = Object.assign({}, msg.headers, {
    Authorization: key ? ('Bearer ' + key) : undefined,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
} catch(e){ node.warn('LLM key not found'); }

msg.rejectUnauthorized = false;
msg.currentConv = { id: conv.id, date: conv.date, feedback: conv.feedback, used_skus: ctx.used };
return [null, msg];
*/
msg.model="gpt-oss-20b";
// Build the payload as an object first
const payloadObj = {
  model: msg.model || 'gpt-4o-mini',
  messages,
  temperature: 0.2,
  max_tokens: 5000,
  // strongly encourage JSON outputs
  response_format: { type: 'text' }
};

// 1) Explicitly STRINGIFY the payload we send over HTTP
const body = JSON.stringify(payloadObj);

// 2) Sanity check: parse back locally. If this throws, you’ll see it here, not on server.
try { JSON.parse(body); }
catch (e) {
    node.warn(body);
  node.warn("JSON parse error");
  // Fail fast to first output so you can inspect msg.llmPayload
  msg.llmPayload = payloadObj;
  msg.payload = { local_json_error: String(e && e.message), preview: body.slice(0, 500) };
  return [msg, null];
}

// Ship the JSON text body
msg.llmPayload = payloadObj;
msg.payload = body;
msg.headers = {};

try {
  const requireGlobal = context.global.get('require');
  const key = (requireGlobal('process').env.ULTA_LLM_KEY || global.get('llmKey') || '');
  msg.headers = Object.assign({}, msg.headers, {
    Authorization: key ? ('Bearer ' + key) : undefined,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
} catch(e){ node.warn('LLM key not found'); }

msg.rejectUnauthorized = false;
msg.currentConv = { id: conv.id, date: conv.date, feedback: conv.feedback, used_skus: ctx.used };

node.warn(msg);
// Route to HTTP node
return [null, msg];
