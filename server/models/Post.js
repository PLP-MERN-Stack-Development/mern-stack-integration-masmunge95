// Post.js - Mongoose model for blog posts

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    featuredImage: {
      type: String,
      default: 'default-post.jpg',
    },
    slug: {
      type: String,
    },
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [String],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create slug from title before saving
PostSchema.pre('save', function (next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
    
  next();
});

// Extract excerpt from content before saving
PostSchema.pre('save', function (next) {
  if (!this.isModified('content')) {
    return next();
  }

  this.excerpt = this.content.substring(0, 197) + (this.content.length > 200 ? '...' : '');
  next();
});

// Extract author info when populating
PostSchema.pre(/^find/, function (next) {
  this.populate({ path: 'author', select: 'name email' });
  next();
});

// Generate SEO-friendly tags before saving
PostSchema.pre('save', function (next) {
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map(tag => tag.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'));
  }
  next();
});

// Virtual for post URL
PostSchema.virtual('url').get(function () {
  return `/posts/${this.slug}`;
});

// Method to add a comment
PostSchema.methods.addComment = function (userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};

// Method to increment view count
PostSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Post', PostSchema); 