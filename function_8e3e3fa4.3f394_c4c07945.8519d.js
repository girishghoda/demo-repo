var require = context.global.get('require');
msg.res = context.global.get(msg._msgid + 'res').res;

// 🔹 Get existing buffer or init new one
var buffer = context.global.get(msg._msgid + '_sse_buffer') || "";

// If not final response, stream partials
if (!msg.payload.finalResponse) {
    buffer += msg.payload.mssg || "";

    // Flush only when buffer ends with whitespace or punctuation
    if (/[ \n.,!?]/.test(buffer.slice(-1))) {
        msg.res.write(`data: ${buffer}\n\n`);
        buffer = ""; // reset after flush
    }

    // Save buffer state for next chunk
    context.global.set(msg._msgid + '_sse_buffer', buffer);

    if (typeof msg.res.flush === 'function') {
        msg.res.flush();
    }
    return null; // stop here for partials
}

// 🔹 Final response
// Flush remaining buffer if any
if (buffer.length > 0) {
    msg.res.write(`data: ${buffer}\n\n`);
    buffer = "";
}
context.global.set(msg._msgid + '_sse_buffer', buffer);

// Send end event
msg.res.write('event: end\ndata: [DONE]\n\n');
msg.res.end();

return null;
// var require = context.global.get('require');

// msg.res = context.global.get(msg._msgid + 'res').res;

// // If not final response, stream and return
// if (!msg.payload.finalResponse) {
//     msg.res.write(`data: ${msg.payload.mssg || ''}\n\n`);
//     if (typeof msg.res.flush === 'function') {
//         msg.res.flush();
//     }
//     return null; // stop here for partials
// }

// // Final message — end SSE
// msg.res.write('event: end\ndata: [DONE]\n\n');
// msg.res.end();
// return null;
