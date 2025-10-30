const { upload } = require('../middleware/uploadMiddleware');

/**
 * A middleware function that handles a single image upload.
 * It includes robust error handling for multer and file validation.
 */
const uploadFile = (req, res, next) => {
    const uploadSingle = upload.single('image');

    console.log('[UploadController] Attempting to upload file...');

    uploadSingle(req, res, (err) => {
        if (err) {
            // Catches errors from multer (e.g., file type mismatch from checkFileType)
            console.error('[UploadController] Multer error:', err.message);
            return res.status(400).json({ message: err.message || 'File upload error' });
        }
        if (!req.file) {
            console.error('[UploadController] No file received in request.');
            return res.status(400).json({ message: 'Please upload a file' });
        }

        console.log('[UploadController] File received and saved:', req.file);
        // If upload is successful, send back the file path
        res.status(201).json({ filePath: `/uploads/${req.file.filename}` });
    });
};

exports.uploadFile = uploadFile;