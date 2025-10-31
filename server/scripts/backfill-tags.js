const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const Post = require('../models/Post');

// Load env vars relative to the server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * A one-time script to backfill tags for posts that were created
 * before the tags feature was implemented.
 */
const backfillTags = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected...');

    const postsToUpdate = await Post.find({
      $or: [{ tags: { $exists: false } }, { tags: { $size: 0 } }],
    });

    if (postsToUpdate.length === 0) {
      console.log('✅ No posts found that need tags backfilled. All posts seem to have tags.');
      process.exit(0);
    }

    console.log(`Found ${postsToUpdate.length} posts to update with auto-generated tags.`);

    const stopWords = new Set(['a', 'an', 'the', 'in', 'on', 'of', 'for', 'to', 'with']);
    let updatedCount = 0;

    for (const post of postsToUpdate) {
      if (post.title) {
        const postTags = post.title
          .toLowerCase()
          .split(' ')
          .filter(word => !stopWords.has(word) && word.length > 2);
        
        post.tags = postTags;
        await post.save();
        updatedCount++;
      }
    }

    console.log(`✅ Successfully updated ${updatedCount} posts.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error backfilling tags:', error);
    process.exit(1);
  }
};

backfillTags();

