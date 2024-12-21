
//this function is called through the validators, not through the routes.

const checkUniqueField = (model, field, message) => {
    return async (value) => {
      console.log("Searching for existing record with field:", field, "and value:", value);
      const existingRecord = await model.findOne({ where: { [field]: value } });

      if (existingRecord) {
        console.log("Existing record found with field:", field, "and value:", value);
        throw new Error(message || `${field}  already exists.`);
      }
      console.log("No existing record found with field:", field, "and value:", value);
      return true;
    };
  };
  
  module.exports = {
    checkUniqueField,
  };