var agents = msg.payload.agent_workflow.agents;
var foundRetriever = false;

// Iterate through the agents object
for (var agentKey in agents) {
    if (agents.hasOwnProperty(agentKey)) {
        var agent = agents[agentKey];
        // Iterate over the tools of each agent
        for (var toolKey in agent.tools) {
            if (agent.tools.hasOwnProperty(toolKey) && agent.tools[toolKey].name === 'retriever') {
                foundRetriever = true;
                break;
            }
        }
        if (foundRetriever) break; // Exit the loop if retriever is found
    }
}

msg.foundRetriever = foundRetriever;
node.warn(foundRetriever);
return msg;