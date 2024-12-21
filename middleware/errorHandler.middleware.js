const errorHandler = (err, req, res, next) => {
  console.error(err.stack); //we log the error to see wtf

  //malformed JSON in request body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Malformed JSON in request body',
      error: err.message,
    });
  }
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
