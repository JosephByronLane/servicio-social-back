const { param } = require("express-validator");

const validateId = [
  param('id')
    .exists().withMessage('ID parameter is required')
    .bail() //this stops it from running the next validation if this one fails
    .isInt({ gt: 0 }).withMessage('Owner ID must be a positive integer')
    .toInt(), 
];

module.exports = {
  validateId,
};