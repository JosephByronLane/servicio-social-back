const { body } = require('express-validator');

const validateOwner = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .trim()
    .escape(),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .trim()
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('telephone')
    .notEmpty()
    .withMessage('Telephone is required')
    .trim()
    .escape(),
];

module.exports = {
  validateOwner,
};