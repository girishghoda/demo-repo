let data = {
    directory: '/interplay_v2/public/private/user_storage/',
    filename: msg.payload.file_name,
    file_type: `.${msg.payload.file_type}`,
    content: msg.payload.content
}
node.warn(data.content);

msg.payload = data;

node.send(msg);