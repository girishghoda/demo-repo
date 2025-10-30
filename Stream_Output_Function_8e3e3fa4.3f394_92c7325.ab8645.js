const mysql = context.global.get('mysql_conn');

msg['res'] = context.global.get(msg._msgid + 'res').res;

const isFinalResponse = msg.payload.finalResponse;

if (!isFinalResponse) {
    // Stream response if not final
    msg.res.status(200).write(msg.payload.mssg);
    msg.res.flush();
    node.send(msg);
} else {
    // Extract file details if available
    if (msg.payload.files_payload && Object.keys(msg.payload.files_payload).length > 0) {
        const fileTypeKey = Object.keys(msg.payload.files_payload)[0]; // Always take the 0th index key
        const fileType = msg.payload.files_payload[fileTypeKey]; // Get the file type value
        const fileData = msg.payload.files_payload.data; // Get the file data
    
        msg.res.write(JSON.stringify({
            fileType: fileType,
            fileData: fileData
        }));
    
        node.warn(`File ready for download: Type - ${fileType}`);
    } else {
        // If no file is present, send an empty response
        msg.res.write(JSON.stringify({}));
    }

    msg.res.end();
    return msg;
}
