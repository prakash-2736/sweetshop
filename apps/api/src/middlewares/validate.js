const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/response");
const { HTTP_STATUS } = require("../constants");

/**
 * Validation Middleware
 * Formats express-validator error chains into standardized JSON outputs
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  return ApiResponse.error(
    res,
    HTTP_STATUS.BAD_REQUEST,
    "Validation failed",
    extractedErrors
  );
};
