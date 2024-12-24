const { query, validationResult } = require('express-validator');

const validateSearch = [
  query('services')
    .optional()
    .customSanitizer((value) => {
      if (typeof value === 'string') {
        return value.split(',').map((service) => service.trim());
      }
      return value;
    })
    .isArray({ min: 1 })
    .withMessage('Services must be an array of strings.')
    .custom(async (service) => {     
        const existingService = await Service.findOne({
          where: {
            name: service,
          },
        });
        if (!existingService) {
          throw new Error(`Service does not exist: ${service}.`);
        }
        return true;
        
      }),
  
  query('services.*')
    .isString()
    .withMessage('Each service must be a valid string.'),

  query('type')
    .optional()
    .toLowerCase()
    .isIn(['casa', 'departamento', 'cuarto'])
    .withMessage("Type must be one of 'casa', 'departamento', 'cuarto'."),

  query('isLookingForRoommate')
    .optional()
    .isIn(['true', 'false'])
    .withMessage("isLookingForRoommate must be 'true' or 'false'."),

  query('isOnlyWomen')
    .optional()
    .isIn(['true', 'false'])
    .withMessage("isOnlyWomen must be 'true' or 'false'."),

  query('minPrice')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('minPrice must be a positive number.'),

  query('maxPrice')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('maxPrice must be a positive number.')
    .custom((value, { req }) => {
      if (req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
        throw new Error('maxPrice must be greater than or equal to minPrice.');
      }
      return true;
    }),

  query('title')
    .optional()
    .isString()
    .withMessage('Title must be a string.')
    .trim()
    .escape(),

  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'alphabetical', 'price_asc', 'price_desc'])
    .withMessage("Sort must be one of 'newest', 'oldest', 'alphabetical', 'price_asc', 'price_desc'."),

  query('paging')
    .optional()
    .isIn(['true', 'false'])
    .withMessage("Paging must be 'true' or 'false'."),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer.')
    .toInt(),

  query('pageSize')
    .optional()
    .isInt({ min: 1 })
    .withMessage('pageSize must be a positive integer.')
    .toInt(),

];

module.exports = validateSearch;
