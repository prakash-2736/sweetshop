const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Generate a short-lived access token
 */
exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRATION }
  );
};

/**
 * Generate a long-lived refresh token
 */
exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    config.JWT_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRATION }
  );
};

/**
 * Verify JWT signature validity
 */
exports.verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};
