const ApiResponse = require("../utils/response");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../constants");

module.exports = (req, res, next) => {
  return ApiResponse.error(
    res,
    HTTP_STATUS.NOT_FOUND,
    `${ERROR_MESSAGES.NOT_FOUND}: ${req.method} ${req.originalUrl}`
  );
};
