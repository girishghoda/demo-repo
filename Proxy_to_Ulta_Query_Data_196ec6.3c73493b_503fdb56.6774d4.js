msg.url = 'https://10.48.13.3/innovation/api/ccp/v1/interplay-conv-ai-lab/getQueryData';
msg.method = 'POST';
msg.headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'host': 'ccpservices-qa.ulta.lcl',
    'origin': 'https://ccpservices-qa.ulta.lcl',
    'pragma': 'no-cache',
    'referer': 'https://ccpservices-qa.ulta.lcl/innovation/api/ccp/v1/interplay-conv-ai-lab/lab',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
};
msg.rejectUnauthorized=false;
return msg;