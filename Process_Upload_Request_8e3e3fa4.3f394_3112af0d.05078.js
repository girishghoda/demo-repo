var require = context.global.get('require');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ensure data directory exists
const DATA_DIR = '/interplay_v2/public/private/user_storage/ResearchDocs/';
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate a unique ID for the paper (used only for metadata)
const generateId = () => crypto.randomBytes(8).toString('hex');

// Helper to save paper metadata
const savePaperMetadata = (paper) => {
    const filePath = path.join(DATA_DIR, `${paper.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(paper, null, 2));
    return paper;
};

async function processRequest() {
    try {
        const { title, fileId } = msg.payload;
        const files = msg.req.files;

        if (!files || files.length === 0) {
            throw new Error('No file uploaded');
        }

        const uploadedFile = files[0];
        const paperId = generateId();

        const originalFileName = uploadedFile.originalname;
        const newFilePath = path.join(DATA_DIR, originalFileName);

        if (!uploadedFile.buffer) {
            throw new Error('Uploaded file does not contain a buffer');
        }

        // Save the uploaded file with its original name
        fs.writeFileSync(newFilePath, uploadedFile.buffer);

        // Create paper metadata
        const paper = {
            id: paperId,
      fileId: fileId,
            title: title || path.basename(originalFileName, path.extname(originalFileName)),
            authors: [],
            abstract: '',
            uploadedDate: new Date().toISOString(),
            status: 'pending',
            pdfPath: newFilePath,
            originalFileName
        };

        savePaperMetadata(paper);

        return { success: true, data: paper };
    } catch (error) {
        console.error('Error processing upload request:', error);
        return { success: false, error: error.message || 'Failed to process upload request' };
    }
}

processRequest()
    .then(result => {
        msg.payload = result;
        node.send(msg);
    })
    .catch(error => {
        msg.payload = { success: false, error: error.message };
        node.send(msg);
    });

return null;
