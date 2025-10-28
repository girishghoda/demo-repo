var require = context.global.get('require'); 

msg.req = {};
msg.req.query = {};
msg.req.query.env = "qa";

return msg;