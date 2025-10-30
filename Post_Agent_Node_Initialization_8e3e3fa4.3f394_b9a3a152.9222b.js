node.warn(msg.payload);
if (msg.payload.message === "Agent workflow Node initiated successfully" ) {
    node.status({fill:"green",shape:"dot",text:"Done"});
    return msg; // Return the status for further processing
} else {
    return null; // Return the status for error or unexpected conditions
}
