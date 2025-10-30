const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
const fs = require('fs');
const path = require('path');
const { getFilePath } = require('../utils/fileUtils');

// @desc    Get all posts
// @route   GET /api/posts
exports.getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find();
    res.json({ posts });
});

// @desc    Get post by id
// @route   GET /api/posts/:id
exports.getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
});

// @desc    Create a new post
// @route   POST /api/posts
exports.createPost = asyncHandler(async (req, res) => {
    const { title, content, category, status } = req.body;
    const post = new Post({
        title,
        content,
        category,
        status,
        featuredImage: getFilePath(req.file),
    });
    const saved = await post.save();
    res.status(201).json(saved);
});

// @desc    Update post by id
// @route   PUT /api/posts/:id
exports.updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Check if a new image path is provided in the update
    const newImagePath = req.body.image;
    const oldImagePath = post.featuredImage;

    // If a new image is provided and it's different from the old one, delete the old file
    if (newImagePath && newImagePath !== oldImagePath && oldImagePath) {
        const oldImageFullPath = path.join(__dirname, '..', oldImagePath);
        if (fs.existsSync(oldImageFullPath)) {
            fs.unlinkSync(oldImageFullPath);
        }
    }

    const updateData = { ...req.body };
    // The frontend sends the new path in the 'image' field, but the model uses 'featuredImage'
    updateData.featuredImage = newImagePath || oldImagePath;
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedPost);
});

// @desc    Delete post by id
// @route   DELETE /api/posts/:id
exports.deletePost = asyncHandler(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post Deleted successfully, Bye' });
});