const require = global.get('require');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join('/interplay_v2/config', 'iterate_agents.sqlite');

let flow_id = null;
if (msg.req && msg.req.query) {
    flow_id = msg.req.query.flow_id;
}

if (!flow_id) {
    msg.payload = { error: "Missing flow_id in request" };
    msg.statusCode = 400;
    return node.send([msg, null]);
}


const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        msg.payload = { error: "DB connection failed: " + err.message };
        msg.statusCode = 500;
        return node.send([null, msg]);
    }
});

const sql = `
    SELECT * FROM chats
    WHERE flow_id = ?
    GROUP BY session_id
    ORDER BY date DESC
`;

db.all(sql, [flow_id], (err, rows) => {
    if (err) {
        msg.payload = { error: "Query failed: " + err.message };
        msg.statusCode = 500;
        db.close();
        return node.send([null, msg]);
    }

    const groupedData = {
        today: [],
        yesterday: [],
        previous7Days: [],
        previous30Days: []
    };

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    for (const row of rows) {
        const { session_id, message, date } = row;
        const dateStr = formatDate(date);

        try {
            const msgJson = JSON.parse(message);
            if (
                msgJson &&
                msgJson.data &&
                msgJson.data.content &&
                msgJson.data.content !== "None"
            ) {

                const chatData = { session_id, title: msgJson.data.content };

                if (dateStr === today) {
                    groupedData.today.push(chatData);
                } else if (dateStr === yesterday) {
                    groupedData.yesterday.push(chatData);
                } else if (isWithinDays(dateStr, 7)) {
                    groupedData.previous7Days.push(chatData);
                } else if (isWithinDays(dateStr, 30)) {
                    groupedData.previous30Days.push(chatData);
                }
            }
        } catch (e) {
            node.warn(`Invalid JSON in message: ${e}`);
        }
    }

    db.close();
    msg.payload = groupedData;
    node.send([msg, null]);
});

// Helpers
function isWithinDays(dateString, days) {
    const givenDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - givenDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= days;
}

function formatDate(date) {
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    return String(date).split(' ')[0];
}
