const tokenUtils = require("../utils/token");
const ApiResponse = require("../utils/response");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../constants");

/**
 * JWT Authentication Middleware
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn(`[Auth Middleware Warning] Unauthorized access attempt: Missing or malformed Bearer token at ${req.originalUrl}`);
      return ApiResponse.error(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = tokenUtils.verifyToken(token);
    
    // Store decoded user info in request object
    req.user = decoded;
    next();
  } catch (err) {
    console.warn(`[Auth Middleware Warning] Unauthorized access attempt: Invalid token validation signature (${err.message})`);
    return ApiResponse.error(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      "Session expired or invalid. Please login again"
    );
  }
};

/**
 * Role-based Authorization Middleware
 * @param {...string} roles Permitted user roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.warn(`[Auth Middleware Warning] Forbidden access attempt: User ${req.user?.email || "unknown"} with role ${req.user?.role || "none"} attempted to access restricted resources.`);
      return ApiResponse.error(
        res,
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGES.FORBIDDEN
      );
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
