const { body } = require('express-validator');

const validateNameeBody = [
  body('name')
    .notEmpty().withMessage('Service name is required')
    .bail() //this stops it from running the next validation if this one fails
    .isString().withMessage('Service name must be a string')
    .trim()
    .escape(),  
];

module.exports = {
  validateNameeBody,
};