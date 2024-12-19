
const { Owner } = require('../models');


const checkUniqueField = (model, field) => {
  return async (req, res, next) => {
    try {
    
        // we grab the parameter from the request body or the request parameters
      const value = req.body[field] || req.params[field];
      if (!value) {
        //check if they exist
        return res.status(400).json({ message: `${field} is required.` });
      }

        // we check if the value already exists in the database
      const existingRecord = await model.findOne({ where: { [field]: value } });
      if (existingRecord) {

        //if so, we return a 400 status code with a message
        return res.status(400).json({ message: `An entry with this ${field} already exists.` });
      }

      //else it goes onto the next middleware thingy.
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = checkUniqueField;