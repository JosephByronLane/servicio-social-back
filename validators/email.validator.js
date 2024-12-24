const { param } = require('express-validator');

const validateEmail = (prefix = '') => [
  param(`${prefix}email`)
    .exists().withMessage('Email parameter is required')
    .isEmail().withMessage('Email must be a valid email address')
];

module.exports = {
    validateEmail,
};