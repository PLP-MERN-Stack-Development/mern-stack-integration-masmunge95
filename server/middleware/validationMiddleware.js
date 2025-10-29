const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

exports.validatePost = [
    body('title')
        .not().isEmpty().withMessage('Title is required.')
        .trim()
        .escape(),
    body('content')
        .not().isEmpty().withMessage('Content is required.')
        .trim(),
    body('category')
        .not().isEmpty().withMessage('Category is required.')
        .isMongoId().withMessage('Invalid category ID.'),
    body('status')
        .optional()
        .isIn(['draft', 'published', 'archived']).withMessage('Invalid status.'),
    validateRequest
];

exports.validateCategory = [
    body('name')
        .not().isEmpty().withMessage('Category name is required.')
        .trim()
        .escape(),
    body('description')
        .optional()
        .trim()
        .escape(),
    validateRequest
];