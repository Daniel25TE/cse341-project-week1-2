const { body, validationResult } = require('express-validator');

const saveContact = [
    body('firstName').isString().notEmpty(),
    body('lastName').isString().notEmpty(),
    body('email').isEmail(),
    body('favoriteColor').isString().notEmpty(),
    body('birthday').optional().isString(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(412).json({ success: false, message: 'Validation failed', data: errors.array() });
        }
        next();
    }
];

module.exports = { saveContact };