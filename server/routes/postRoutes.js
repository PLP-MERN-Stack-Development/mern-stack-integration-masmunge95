const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
const { validatePost } = require('../middleware/validationMiddleware');
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/postController');

router.route('/').get(getAllPosts).post(upload.single('image'), validatePost, createPost);
router.route('/:id').get(getPostById).put(upload.single('image'), validatePost, updatePost).delete(deletePost);

module.exports = router;