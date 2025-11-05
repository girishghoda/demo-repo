node.warn(msg.payload);

if (msg.status === "Success: Vector database built successfully" || msg.status === "Vector database already exists" || msg.status === "Success: No files provided – nothing to build") {
    node.status({fill:"green",shape:"dot",text:"Done"});
    return msg; // Return the status for further processing
} else {
    return null; // Return the status for error or unexpected conditions
}
