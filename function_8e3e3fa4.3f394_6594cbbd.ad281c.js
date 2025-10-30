var require = context.global.get('require'); 


const res = {res: msg.res};

msg.res.setHeader('Content-Type', 'text/event-stream');
msg.res.setHeader('Connection', 'keep-alive');
msg.res.setHeader('Cache-Control', 'no-cache');
msg.res.setHeader('X-Accel-Buffering', 'no');

context.global.set(msg._msgid+'res', res)
var newmsg = {};  // Define newmsg variable
newmsg.payload = msg.payload


return newmsg;