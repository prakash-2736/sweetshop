const { body } = require("express-validator");
const validateMiddleware = require("../middlewares/validate");

exports.validateRegister = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validateMiddleware,
];

exports.validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
  validateMiddleware,
];

exports.validateUpdateProfile = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("phone")
    .optional()
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits"),
  validateMiddleware,
];

exports.validateChangePassword = [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  validateMiddleware,
];

exports.validateRefreshToken = [
  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token is required"),
  validateMiddleware,
];
