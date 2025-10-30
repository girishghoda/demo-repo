node.warn(msg.payload);

// Retrieve the globally stored agent flow configuration
let globalConfig = context.global.get("AGENT_FLOW_CONFIG");

if (!globalConfig) {
    node.error("Global config not found");
    return null;
}

// Extract the agent workflow from the global config
let agentWorkflow = globalConfig.agent_workflow || {};
// let flow_id = globalConfig.flow_id;
let flow_id = msg.payload.flow_id;
node.warn(flow_id);

let thread_id = globalConfig.thread_id;

// Get the searchText and sessionid from the incoming HTTP POST request payload
let searchText = msg.payload.searchText || msg.payload.human_text;
let sessionid = msg.payload.sessionid;
let user_id = msg.payload.user_id;

// Ensure sessionid is provided, otherwise return an error
if (!sessionid) {
    node.error("Session ID is missing");
    return null;
}

// Construct the payload with updated question and other fields
msg.payload = {
    question: searchText,
    human_feedback: agentWorkflow.human_feedback || false,
    thread_id: sessionid,
    flow_id:flow_id,
    user_id:user_id,
    agent_workflow: {
        agents: agentWorkflow.agents || {},
        routes: agentWorkflow.routes || {},
        memory: agentWorkflow.memory || { type: "sqlite" }
    },
    initial: false
};

node.warn(msg.payload);

// Return the modified payload
return msg;

// // Log incoming payload for debugging
// node.warn(msg.payload);

// // Retrieve the globally stored agent flow configuration
// let globalConfig = context.global.get("AGENT_FLOW_CONFIG");

// if (!globalConfig) {
//     node.error("Global config not found");
//     return null;
// }

// // Extract the agent workflow from the global config
// let agentWorkflow = globalConfig.agent_workflow || {};
// let flow_id = globalConfig.flow_id;
// let thread_id = globalConfig.thread_id;
// // Get the searchText from the incoming HTTP POST request payload
// let searchText = msg.payload.searchText || msg.payload.human_text || "Default question";

// // Construct the payload with updated question and other fields
// msg.payload = {
//     question: searchText,
//     human_feedback: agentWorkflow.human_feedback || false,
//     thread_id: thread_id || "default_thread_1",
//     agent_workflow: {
//         agents: agentWorkflow.agents || {},
//         routes: agentWorkflow.routes || {},
//         memory: agentWorkflow.memory || { type: "sqlite" }
//     }
// };
// node.warn(msg.payload);

// // Return the modified payload
// return msg;
