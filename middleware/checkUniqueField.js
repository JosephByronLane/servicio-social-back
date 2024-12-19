const checkUniqueField = (model, field) => {
    return async (value) => {
      const existingRecord = await model.findOne({ where: { [field]: value } });
      if (existingRecord) {
        throw new Error(`${field} in ${model} already exists.`);
      }
      return true;
    };
  };
  
  module.exports = {
    checkUniqueField,
  };