const { body } = require('express-validator');

const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase and numbers')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
];

const imageValidation = [
    // add validation for post image mime type and size if needed
    body('image_url')
        .notEmpty()
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Image file is required');
            }
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                throw new Error('Invalid image format. Only JPEG, PNG, and GIF are allowed.');
            }
            if (req.file.size > 30 * 1024 * 1024) { // 5MB limit
                throw new Error('Image size exceeds the limit of 5MB');
            }
            return true;
        })
]

module.exports = {
    registerValidation,
    loginValidation,
    imageValidation
};