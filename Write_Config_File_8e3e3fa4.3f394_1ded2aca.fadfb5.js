const require = context.global.get('require');

const fs = require('fs');
const path = require('path');

const configPath = '/interplay_v2/public/private/Apps/ResearchAgent/research_agent_config.json';

try {
    const config = msg.payload;

    if (typeof config !== 'object') {
        throw new Error('Invalid configuration format. Must be a JSON object.');
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

    msg.payload = { success: true, message: 'Configuration updated successfully.' };
    msg.statusCode = 200;
} catch (err) {
    msg.payload = { success: false, error: err.message };
    msg.statusCode = 500;
}

return msg;