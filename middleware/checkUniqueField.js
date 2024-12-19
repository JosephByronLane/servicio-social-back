
//this function is called through the validators, not through the routes.

const checkUniqueField = (model, field, message) => {
    return async (value) => {
      const existingRecord = await model.findOne({ where: { [field]: value } });
      if (existingRecord) {
        throw new Error(message || `${field}  already exists.`);
      }
      return true;
    };
  };
  
  module.exports = {
    checkUniqueField,
  };