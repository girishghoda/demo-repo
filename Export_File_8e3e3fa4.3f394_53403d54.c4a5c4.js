var require = context.global.get('require'); 
var fs = require('fs');

async function exportFile() {
    if(msg.payload.file_path) {
        fs.readFile(msg.payload.file_path, (err, data) => {
            node.warn([err, data])
            if (err) {
                msg.res.status(500).send("Error reading file");
            } else {
                msg.res.setHeader("Content-Type", "application/octet-stream");
                msg.res.setHeader("Content-Disposition", "attachment; filename=sample.txt");
                msg.res.send(data); 
            }
        });
    } else {
        msg.res.status(500).send("Error reading file");
    }
}

exportFile();