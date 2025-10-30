const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');

// The upload route. Authentication is temporarily removed for testing.
router.post('/', uploadFile);

module.exports = router;