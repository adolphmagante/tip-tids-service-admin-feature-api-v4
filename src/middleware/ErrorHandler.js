// middleware/errorHandler.js
const logger = require('../utils/Logger');

module.exports = (err, req, res, next) => {
  // Set error status if not already set
  const status = err.status || 500;

  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Log the error
  logger.error(`${status}: ${err.message}`);
  if (err.stack) {
    logger.error(err.stack);
  }

  // Send JSON response
  res.status(status).json({
    status,
    message: err.message,
    // Optionally include the stack trace if in development mode
    ...(req.app.get("env") === "development" && { stack: err.stack }),
  });
};
