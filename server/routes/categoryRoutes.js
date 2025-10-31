const express = require('express');
const publicRouter = express.Router();
const privateRouter = express.Router();
const { validateCategory } = require('../middleware/validationMiddleware');
const { requireRole } = require('../middleware/authMiddleware');
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// --- Public Routes ---
publicRouter.route('/').get(getAllCategories);

// --- Private (Authenticated) Routes ---
privateRouter.route('/').post(requireRole('editor'), validateCategory, createCategory);
privateRouter.route('/:id').put(requireRole('editor'), validateCategory, updateCategory).delete(requireRole('editor'), deleteCategory);

module.exports = { public: publicRouter, private: privateRouter };
