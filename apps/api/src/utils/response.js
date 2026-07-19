/**
 * Standardized API Response Helper
 */
class ApiResponse {
  /**
   * Send a successful JSON response
   * @param {object} res Express response object
   * @param {number} status HTTP status code
   * @param {string} message Description message
   * @param {any} data Response body data
   * @param {object} meta Optional pagination or metadata
   */
  static success(res, status = 200, message = "Success", data = null, meta = null) {
    const responsePayload = {
      success: true,
      message,
    };
    if (data !== null) responsePayload.data = data;
    if (meta !== null) responsePayload.meta = meta;
    
    return res.status(status).json(responsePayload);
  }

  /**
   * Send an error JSON response
   * @param {object} res Express response object
   * @param {number} status HTTP status code
   * @param {string} message Error description message
   * @param {array} errors Detailed error array (e.g. from validators)
   */
  static error(res, status = 500, message = "Internal Server Error", errors = null) {
    const responsePayload = {
      success: false,
      message,
    };
    if (errors !== null) responsePayload.errors = errors;
    
    return res.status(status).json(responsePayload);
  }
}

module.exports = ApiResponse;
