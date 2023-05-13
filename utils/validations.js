const { body } = require('express-validator');

exports.loginValidation = [
	body('email', 'Invalid mail format').isEmail(),
	body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
];

exports.registerValidation = [
	body('email', 'Invalid mail format').isEmail(),
	body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
	body('fullName', 'Enter a name').isLength({ min: 2 }),
	body('avatarUrl', 'Invalid avatar link').optional().isURL(),
];
