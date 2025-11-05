const require = global.get('require');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const session_id = msg.req && msg.req.params && msg.req.params.session_id;
const flow_id = msg.req && msg.req.query && msg.req.query.flow_id;

if (!session_id || !flow_id) {
    msg.payload = { error: "Missing session_id or flow_id" };
    msg.statusCode = 400;
    return node.send([msg, null]);
}

// Set the correct SQLite DB path
const dbPath = path.join('/interplay_v2/config', 'iterate_agents.sqlite');

// Open DB
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        msg.payload = { error: "DB connection failed: " + err.message };
        msg.statusCode = 500;
        return node.send([null, msg]);
    }

    const sql = `
        SELECT session_id, message 
        FROM chats 
        WHERE session_id = ? AND flow_id = ?
        ORDER BY date ASC
    `;

    db.all(sql, [session_id, flow_id], (err, rows) => {
        if (err) {
            msg.payload = { error: "Query failed: " + err.message };
            msg.statusCode = 500;
            return node.send([null, msg]);
        }

        const response = [];

        for (let i = 0; i < rows.length; i++) {
            try {
                const msgJson = JSON.parse(rows[i].message);

                if (
                    msgJson &&
                    msgJson.data &&
                    msgJson.data.content &&
                    msgJson.data.content !== "None"
                ) {
                    if (msgJson.type === 'ai') {
                        response.push({ bot: { mssg: msgJson.data.content } });
                    } else {
                        response.push({ user: { mssg: msgJson.data.content } });
                    }
                }
            } catch (e) {
                node.warn("Failed to parse message JSON: " + e);
            }
        }

        msg.payload = response;
        db.close();
        return node.send([msg, null]);
    });
});
