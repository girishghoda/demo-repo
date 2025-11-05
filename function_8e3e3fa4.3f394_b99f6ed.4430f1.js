var require = context.global.get('require'); 

node.warn(msg);

const res = {res: msg.res};
context.global.set(msg._msgid+'res', res)
var newmsg = {};  // Define newmsg variable
newmsg.payload = msg.payload


return newmsg;