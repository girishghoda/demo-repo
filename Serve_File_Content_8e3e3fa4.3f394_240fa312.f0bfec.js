// Modified function to handle both PDF and text files
const require = context.global.get('require');
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/interplay_v2/public/private/user_storage/ResearchDocs/';

try {
    const fileName = msg.req.params.fileName;
    
    if (!fileName) {
        throw new Error('File name is required');
    }

    // Try to find the file directly by filename
    const filePath = path.join(DATA_DIR, fileName);
    
    if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
    }

    // Determine file type based on extension
    const fileExtension = path.extname(fileName).toLowerCase();
    
    if (fileExtension === '.txt' || fileExtension === '.text') {
        // Handle text files
        const textContent = fs.readFileSync(filePath, 'utf-8');
        
        // Set appropriate headers for text content
        msg.headers = {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Length': Buffer.byteLength(textContent),
            'Cache-Control': 'public, max-age=3600',
            'Content-Disposition': 'inline; filename="' + path.basename(filePath) + '"'
        };
        
        msg.payload = textContent;
    } else {
        // Default to PDF handling for all other file types
        const fileBuffer = fs.readFileSync(filePath);
        
        // Set appropriate headers for PDF content
        msg.headers = {
            'Content-Type': 'application/pdf',
            'Content-Length': fileBuffer.length,
            'Cache-Control': 'public, max-age=3600',
            'Content-Disposition': 'inline; filename="' + path.basename(filePath) + '"'
        };
        
        msg.payload = fileBuffer;
    }
    
    msg.statusCode = 200;
    
} catch (error) {
    console.error('Error serving file content:', error);
    msg.payload = { success: false, error: error.message || 'Failed to load file content' };
    msg.statusCode = 404;
    msg.headers = {
        'Content-Type': 'application/json'
    };
}

return msg;
