const { body } = require('express-validator');
const { Service } = require('../models');

const validateServices = (prefix = '') => [
  body(`${prefix}services`)
    .exists({ checkFalsy: true })
    .withMessage('Services field is required.')
    .isArray({ min: 1 })
    .withMessage('Services must be an array with at least one service.'),
  
  body(`${prefix}services.*`)
    .isString()
    .withMessage('Each service must be a string.')
    .trim()
    .toLowerCase()
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
  
  body(`${prefix}services`)
    .custom((services) => {
      const uniqueServices = new Set(services);
      if (uniqueServices.size !== services.length) {
        throw new Error('Duplicate services are not allowed.');
      }
      return true;
    }),
];

module.exports = {
  validateServices,
};
