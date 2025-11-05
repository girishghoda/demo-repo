// Load all metadata JSON files from the paper directory
const require = context.global.get('require');
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/interplay_v2/public/private/user_storage/ResearchDocs/';

const filters = msg.req.query || {}; // support optional filtering from URL query

try {
    if (!fs.existsSync(DATA_DIR)) {
        throw new Error('Data directory does not exist.');
    }

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

    const papers = files.map(file => {
        const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
        return JSON.parse(raw);
    });

    // Optional filtering (e.g., by status or title substring)
    const filtered = papers.filter(p => {
        return Object.entries(filters).every(([key, value]) => {
            if (typeof p[key] === 'string') {
                return p[key].toLowerCase().includes(value.toLowerCase());
            }
            return true;
        });
    });

    msg.payload = { success: true, data: filtered };
    msg.statusCode = 200;
} catch (err) {
    msg.payload = { success: false, error: err.message || 'Failed to load paper metadata' };
    msg.statusCode = 500;
    node.error(err.message);
}

return msg;