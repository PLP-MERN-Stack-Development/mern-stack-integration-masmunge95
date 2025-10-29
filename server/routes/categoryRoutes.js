const express = require('express');
const router = express.Router();
const { validateCategory } = require('../middleware/validationMiddleware');
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

router.route('/').get(getAllCategories).post(validateCategory, createCategory);
router.route('/:id').put(validateCategory, updateCategory).delete(deleteCategory);

module.exports = router;
