const queryParams = msg.req.query;
let queryString = '';
if (Object.keys(queryParams).length > 0) {
    queryString = '?' + Object.keys(queryParams).map(key => 
        encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key])
    ).join('&');
}
msg.url = `https://10.48.13.3/innovation/api/ccp/v1/interplay-conv-ai-lab/getPrompt${queryString}`;
msg.method = 'GET';
msg.headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'pragma': 'no-cache',
    'host': 'ccpservices-qa.ulta.lcl',
    'referer': 'https://ccpservices-qa.ulta.lcl/innovation/api/ccp/v1/interplay-conv-ai-lab/lab',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
};
msg.rejectUnauthorized=false;
msg.payload = '';
return msg;