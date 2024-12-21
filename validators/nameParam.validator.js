const { param } = require("express-validator");
const { Service } = require("../models");
const { checkUniqueField } = require("../middleware/checkUniqueField.middleware");

const validateNameParam = [
  param('name')
    .exists().withMessage('Name parameter is required')
    .bail() //this stops it from running the next validation if this one fails
    .isString().withMessage('Name must be a String')
    .trim(),

    ];

module.exports = {
    validateNameParam,
};