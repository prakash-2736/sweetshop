const { body, param } = require("express-validator");
const validateMiddleware = require("../../../middlewares/validate");

exports.validateCreateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long"),
  body("description")
    .optional()
    .trim(),
  body("image")
    .optional()
    .trim(),
  validateMiddleware,
];

exports.validateUpdateCategory = [
  param("id")
    .isMongoId()
    .withMessage("Invalid category ID path parameter"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long"),
  validateMiddleware,
];
