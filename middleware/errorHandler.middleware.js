const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); //we log the error to see wtf

  //malformed JSON in request body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Malformed JSON in request body',
      error: err.message,
    });
  }

  //incase user breaks multer image upload rules
  //TODO: doesnt seem to work
  if (err instanceof multer.MulterError) {
    let message = 'File upload error';

    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size is too large. Maximum limit is 5MB.';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files uploaded. Maximum limit is 10.';
        break;
      case 'LIMIT_FIELD_KEY':
        message = 'Field name is too long.';
        break;
      case 'LIMIT_FIELD_VALUE':
        message = 'Field value is too long.';
        break;
      case 'LIMIT_FIELD_COUNT':
        message = 'Too many fields.';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field.';
        break;
      default:
        message = "Error, contact admin";
    }

    return res.status(500).json({ message });
  }
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
