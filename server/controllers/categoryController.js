const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all categories
// @route   GET /api/categories
exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json({ categories });
});

// @desc    Create a new category
// @route   POST /api/categories
exports.createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    const saved = await category.save();
    res.status(201).json(saved);
});

// @desc    Update category by id
// @route   PUT /api/categories/:id
exports.updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
});

// @desc    Delete category by id
// @route   DELETE /api/categories/:id
exports.deleteCategory = asyncHandler(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category Deleted successfully, Bye' });
});