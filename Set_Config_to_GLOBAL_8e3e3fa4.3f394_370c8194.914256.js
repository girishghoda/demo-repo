var require = context.global.get('require'); 
var uuid = require('uuid'); // Import uuid to generate unique thread_id

// Generate a unique thread_id
var thread_id = uuid.v4();

// Set the thread_id in msg.payload
msg.payload.thread_id = thread_id;

// Store the config in global context
context.global.set("AGENT_FLOW_CONFIG", msg.payload);
global.set("RESEARCH_AGENT_WORKFLOW_READY", false);  // ✅ Set flag



node.warn(msg.payload);
return msg;
