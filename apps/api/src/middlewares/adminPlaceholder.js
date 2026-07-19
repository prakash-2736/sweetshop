const ApiResponse = require("../utils/response");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../constants");

/**
 * Admin Role Check Placeholder Middleware
 */
module.exports = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  
  return ApiResponse.error(
    res,
    HTTP_STATUS.FORBIDDEN,
    ERROR_MESSAGES.FORBIDDEN
  );
};
