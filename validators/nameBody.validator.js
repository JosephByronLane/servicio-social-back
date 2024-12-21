const { body } = require('express-validator');
const { checkUniqueField } = require('../middleware/checkUniqueField.middleware');
const { Service } = require('../models');

//TODO: If  its only used in the Service model, rename it to validateService
const validateNameeBody = [
  body('name')
    .notEmpty().withMessage('Service name is required')
    .bail() //this stops it from running the next validation if this one fails
    .isString().withMessage('Service name must be a string')
    .trim()
    .custom(checkUniqueField(Service, 'name', 'A service with that name already exists.'))
    .escape(),  
];

module.exports = {
  validateNameeBody,
};