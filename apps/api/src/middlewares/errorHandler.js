const ApiResponse = require("../utils/response");
const { NODE_ENV } = require("../config");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../constants");

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;
  
  // Prepare stack trace if not in production
  const errorDetails = NODE_ENV === "development" ? {
    stack: err.stack,
    details: err
  } : null;

  return ApiResponse.error(res, status, message, errorDetails);
};
