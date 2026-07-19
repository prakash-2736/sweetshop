module.exports = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
  },
  ERROR_MESSAGES: {
    NOT_FOUND: "Resource not found on this server",
    INTERNAL_ERROR: "An unexpected error occurred",
    UNAUTHORIZED: "Access denied. Authentication required",
    FORBIDDEN: "Access denied. Administrator privileges required",
    RATE_LIMIT: "Too many requests. Please try again later",
  }
};
