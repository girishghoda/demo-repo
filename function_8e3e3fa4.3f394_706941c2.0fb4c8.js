var require = context.global.get('require');

msg['res'] = context.global.get(msg._msgid + 'res').res;

return msg;