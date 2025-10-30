msg.url = 'https://10.48.13.3/innovation/api/ccp/v1/interplay-conv-ai-lab/feedback/conversation-details';
msg.method = 'POST';
msg.headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'host': 'ccpservices-qa.ulta.lcl',
    'origin': 'https://ccpservices-qa.ulta.lcl',
    'pragma': 'no-cache',
    'referer': 'https://ccpservices-qa.ultima.lcl/innovation/api/ccp/v1/interplay-conv-ai-lab/lab',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
};
try {
  const requireGlobal = global.get('require');
  const env = requireGlobal('process').env || {};
  const apiKey = env.ULTA_API_KEY || (global.get('ultaApiKey') || '');
  const bearer = env.ULTA_API_BEARER || (global.get('ultaApiBearer') || '');
  if (apiKey) { msg.headers['x-api-key'] = apiKey; }
  if (bearer) { msg.headers['Authorization'] = 'Bearer ' + bearer; }
} catch (e) {}
msg.rejectUnauthorized=false;
return msg;