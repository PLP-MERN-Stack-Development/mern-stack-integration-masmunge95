const Post = require('../models/Post');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const fs = require('fs');
const path = require('path');

// @desc    Get all posts
// @route   GET /api/posts
exports.getAllPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, tag, authorId } = req.query;
    const query = {
        // Public can only see published posts, editors can see their own posts of any status
        ...(authorId ? { authorId } : { status: 'published' })
    };

    if (category) {
        query.category = category;
    }
    if (tag) {
        // Case-insensitive tag search
        query.tags = { $regex: new RegExp(`^${tag}$`, 'i') };
    }

    const posts = await Post.find(query)
        .populate('category')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const count = await Post.countDocuments(query);

    res.json({ posts, totalPages: Math.ceil(count / limit), currentPage: page });
});

// @desc    Get post by id
// @route   GET /api/posts/:id
exports.getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    // Find by slug or ID for flexibility
    const query = isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id };
    const post = await Post.findOne(query).populate('category');

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    // If req.auth exists, it means this request came through a private, authenticated route.
    if (req.auth) {
        const userRole = req.auth.sessionClaims?.metadata?.role;
        const userId = req.auth.sessionClaims?.sub; // Use .sub for the user ID, which is always present.

        // Only increment the view count if the user has the 'viewer' role.
        if (userRole === 'viewer' && userId) {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const userView = post.viewedBy.find(view => view.userId === userId);

            // If the user hasn't viewed before, or their last view was over 24 hours ago
            if (!userView || userView.lastViewed < twentyFourHoursAgo) {
                console.log(`[View Count] Unique view by viewer ${userId}. Incrementing count.`);
                post.viewCount += 1;

                if (userView) {
                    // Update existing view record
                    userView.lastViewed = new Date();
                } else {
                    // Add new view record
                    post.viewedBy.push({ userId, lastViewed: new Date() });
                }
                await post.save();
            }
        }
    } else {
        console.log('[View Count] Anonymous user detected. Not incrementing view count.');
    }
    res.json(post);
});

// @desc    Create a new post
// @route   POST /api/posts
exports.createPost = asyncHandler(async (req, res) => {
    const { title, content, category, status, tags } = req.body;
    let authorName = req.body.author;
    let postTags = [];

    if (tags) {
        postTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else if (title) {
        // Auto-generate tags from title if none are provided
        const stopWords = new Set(['a', 'an', 'the', 'in', 'on', 'of', 'for', 'to', 'with']);
        postTags = title.toLowerCase().split(' ').filter(word => !stopWords.has(word) && word.length > 2);
    }

    // If no author is provided, get it from the authenticated Clerk user
    if (!authorName && req.auth.userId) {
        const user = await clerkClient.users.getUser(req.auth.userId);
        // Construct full name, then fallback to username, then to 'Anonymous'
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
        authorName = fullName || user.username || 'Anonymous';
    }

    const post = new Post({
        title,
        content,
        category,
        status,
        author: authorName,
        authorId: req.auth.userId,
        tags: postTags,
        featuredImage: req.file ? `/uploads/${req.file.filename}` : null,
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

    // Ownership check
    if (post.authorId !== req.auth.userId) {
        res.status(403);
        throw new Error('User not authorized to update this post');
    }

    const updateData = { ...req.body };

    // If a new image was uploaded via multer, handle file deletion and update the path.
    if (req.file) {
        // Set the new image path in the data to be updated.
        updateData.featuredImage = `/uploads/${req.file.filename}`;

        // Securely delete the old image if it exists and is not the default placeholder.
        const oldImagePath = post.featuredImage;
        if (oldImagePath && !oldImagePath.includes('default-post.jpg')) {
            const oldImageFullPath = path.join(__dirname, '..', oldImagePath);
            if (fs.existsSync(oldImageFullPath)) {
                fs.unlinkSync(oldImageFullPath);
            }
        }
    }

    // Handle tags update
    if (updateData.tags && typeof updateData.tags === 'string') {
        updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else if (!updateData.tags && updateData.title) {
        // If tags are cleared, auto-generate from title
        const stopWords = new Set(['a', 'an', 'the', 'in', 'on', 'of', 'for', 'to', 'with']);
        updateData.tags = updateData.title.toLowerCase().split(' ').filter(word => !stopWords.has(word) && word.length > 2);
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedPost);
});

// @desc    Update post status by id
// @route   PATCH /api/posts/:id/status
exports.updatePostStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status value.');
    }

    const post = await Post.findById(req.params.id);
    if (post && post.authorId !== req.auth.userId) {
        res.status(403);
        throw new Error('User not authorized to update this post');
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });

    res.json(updatedPost);
});

// @desc    Delete post by id
// @route   DELETE /api/posts/:id
exports.deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Ownership check
    if (post.authorId !== req.auth.userId) {
        res.status(403);
        throw new Error('User not authorized to delete this post');
    }

    // If the post has a featured image, delete it from the server
    if (post.featuredImage && !post.featuredImage.includes('default-post.jpg')) {
        const imagePath = path.join(__dirname, '..', post.featuredImage);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    await post.deleteOne();
    res.json({ message: 'Post Deleted successfully, Bye' });
});

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
exports.addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const user = await clerkClient.users.getUser(req.auth.userId);
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
    const userName = fullName || user.username || 'Anonymous';

    await post.addComment(req.auth.userId, userName, content);
    res.status(201).json(post);
});

// @desc    Update a comment on a post
// @route   PUT /api/posts/:id/comments/:commentId
exports.updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    // Ownership check for the comment
    if (comment.userId !== req.auth.userId) {
        res.status(403);
        throw new Error('User not authorized to update this comment');
    }

    comment.content = content;
    await post.save();
    res.json(post);
});

// @desc    Delete a comment from a post
// @route   DELETE /api/posts/:id/comments/:commentId
exports.deleteComment = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.id(req.params.commentId);

    // Ownership check for the comment
    if (comment.userId !== req.auth.userId) {
        res.status(403);
        throw new Error('User not authorized to delete this comment');
    }

    comment.deleteOne();
    await post.save();
    res.json({ message: 'Comment removed' });
});