const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
const { getFilePath } = require('../utils/fileUtils');

router.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image Uploaded',
        image: getFilePath(req.file)
    });
});

module.exports = router;