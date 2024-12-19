const { body } = require('express-validator');
const { param } = require('express-validator');

const validateEmail = [
  param('email')
    .exists().withMessage('Email parameter is required')
    .bail() //this stops it from running the next validation if this one fails
    .isEmail().withMessage('Email must be a valid email address')
];

module.exports = {
    validateEmail,
};