const errorHandler = (err, req, res, next) => {
  const status = err.code || 500;
  const message = err.message || "Internal Server Error";
  // Mongoose duplicate key error
  if (status === 11000) {
    const message = "Duplicate field value entered";
    return res.status(400).json({
      success: false,
      error: message,
    });
  }
  //defult error
  return res.status(status).json({
    success: false,
    message,
  });
};
module.exports = errorHandler;
