const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const Category = require('../models/Category');

// Load env vars relative to the server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * A one-time script to assign a 'system-template' authorId to existing
 * categories that do not have an authorId. This marks them as templates
 * that can be cloned for new editors.
 */
const backfillCategoryAuthor = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected...');

    // Find all categories where authorId does not exist
    const categoriesToUpdate = await Category.find({ authorId: { $exists: false } });

    if (categoriesToUpdate.length === 0) {
      console.log('✅ No categories found that need an authorId. All categories seem to be assigned.');
      process.exit(0);
    }

    console.log(`Found ${categoriesToUpdate.length} categories to update.`);

    const result = await Category.updateMany(
      { authorId: { $exists: false } },
      { $set: { authorId: 'system-template' } }
    );

    console.log(`✅ Successfully updated ${result.modifiedCount} categories to be system templates.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error backfilling category authorIds:', error);
    process.exit(1);
  }
};

backfillCategoryAuthor();