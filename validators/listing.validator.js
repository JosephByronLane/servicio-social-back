const { body } = require('express-validator');
const { checkUniqueField } = require("../middleware/checkUniqueField.middleware");
const { Owner } = require('../models');

const validateListing  = (prefix = '') => [
    body(`${prefix}title`)
    .notEmpty()
    .withMessage('title is required')
    .trim()
    .escape(),

    body(`${prefix}description`)
    .notEmpty()
    .withMessage('description is required')
    .trim()
    .escape(),
];

module.exports = {
    validateListing,
};