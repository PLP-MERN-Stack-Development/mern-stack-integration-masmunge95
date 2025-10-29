const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
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
    const updateData = { ...req.body };
    if (req.file) {
        updateData.featuredImage = getFilePath(req.file);
    }
    const post = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(post);
});

// @desc    Delete post by id
// @route   DELETE /api/posts/:id
exports.deletePost = asyncHandler(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post Deleted successfully, Bye' });
});