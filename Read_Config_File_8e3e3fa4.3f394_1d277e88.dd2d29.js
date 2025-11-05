const require = context.global.get('require');

const fs = require('fs');
const path = require('path');

const configPath = '/interplay_v2/public/private/Apps/ResearchAgent/research_agent_config.json';

try {
    if (!fs.existsSync(configPath)) {
        throw new Error('Configuration file not found.');
    }
    const raw = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(raw);
    msg.payload = { success: true, data: config };
    msg.statusCode = 200;
} catch (err) {
    msg.payload = { success: false, error: err.message };
    msg.statusCode = 500;
}

return msg;