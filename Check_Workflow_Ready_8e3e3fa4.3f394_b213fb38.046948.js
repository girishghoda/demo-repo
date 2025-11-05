const isReady = global.get("RESEARCH_AGENT_WORKFLOW_READY");
msg.retries = msg.retries || 0;

if (isReady) {
    node.warn("Agent workflow is ready");
    return [msg, null];
} else if (msg.retries >= 30) {
    node.warn("Agent workflow is not ready, retry");

    msg.payload = { error: "Timeout: Agent workflow not ready." };
    return [null, msg];
} else {
    msg.retries += 1;
    msg.delay = 15000;
    return [null, msg];
}