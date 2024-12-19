
const { Owner } = require('../models');


const checkUniqueField = (model, field) => {
  return async (req, res, next) => {
    try {
      const value = req.body[field] || req.params[field];
      if (!value) {
        return res.status(400).json({ message: `${field} is required.` });
      }

      const existingRecord = await model.findOne({ where: { [field]: value } });
      if (existingRecord) {
        return res.status(400).json({ message: `A record with this ${field} already exists.` });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = checkUniqueField;