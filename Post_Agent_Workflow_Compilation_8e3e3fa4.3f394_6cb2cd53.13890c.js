node.warn(msg.payload);
if (msg.payload.message === "Agent workflow compiled successfully" ) {
    node.status({fill:"green",shape:"dot",text:"Done"});
    global.set("RESEARCH_AGENT_WORKFLOW_READY", true);  // ✅ Set flag
    return msg; // Return the status for further processing
} else {
    return null; // Return the status for error or unexpected conditions
}
