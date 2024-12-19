const { body } = require('express-validator');
const { checkUniqueField } = require("../middleware/checkUniqueField.middleware");
const { Owner } = require('../models');

const validateOwner  = (prefix = '') => [
    body(`${prefix}firstName`)
    .notEmpty()
    .withMessage('First name is required')
    .trim()
    .escape(),

    body(`${prefix}lastName`)
    .notEmpty()
    .withMessage('Last name is required')
    .trim()
    .escape(),

    body(`${prefix}email`)
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .custom(checkUniqueField(Owner, 'email', 'A user with that email already exists.')),

    body(`${prefix}telephone`)
    .notEmpty()
    .withMessage('Telephone is required')
    .trim()
    .escape(),
];

module.exports = {
  validateOwner,
};