const { check } = require('express-validator');

const validateHouse = (prefix = '') => [
  check(`${prefix}type`)
    .notEmpty().withMessage('Property type is required.')
    .isString().withMessage('Property type must be a string.')
    .trim()
    .toLowerCase()
    .isIn(['casa', 'departamento', 'cuarto']).withMessage('Invalid property type. Mus tbe "Casa", "Departamento" or "Cuarto".'),
  
  check(`${prefix}isLookingForRoommate`)
    .optional()
    .isBoolean().withMessage('isLookingForRoommate must be a boolean.'),
  
  check(`${prefix}isOnlyWomen`)
    .optional()
    .isBoolean().withMessage('isOnlyWomen must be a boolean.'),
  
  check(`${prefix}price`)
    .notEmpty().withMessage('Price is required.')
    .isDecimal().withMessage('Price must be a decimal number.'),
  
  check(`${prefix}street`)
    .notEmpty().withMessage('Street address is required.')
    .isString().withMessage('Street address must be a string.')
    .isLength({ max: 255 }).withMessage('Street address must be at most 255 characters long.'),
  
  check(`${prefix}postalCode`)
    .notEmpty().withMessage('Postal code is required.')
    .isString().withMessage('Postal code must be a string.')
    .isLength({ max: 20 }).withMessage('Postal code must be at most 20 characters long.'),
  
  check(`${prefix}crossings`)
    .notEmpty().withMessage('Crossings are required.')
    .isString().withMessage('Crossings must be a string.')
    .isLength({ max: 100 }).withMessage('City must be at most 100 characters long.'),
  
  check(`${prefix}colony`)
    .notEmpty().withMessage('Colony is required.')
    .isString().withMessage('Colony must be a string.')
    .isLength({ max: 100 }).withMessage('Country must be at most 100 characters long.'),
];

module.exports = {
  validateHouse,
};
