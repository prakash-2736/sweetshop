const { body } = require("express-validator");
const validateMiddleware = require("../../../middlewares/validate");

exports.validateBulkStatus = [
  body("productIds")
    .isArray({ min: 1 })
    .withMessage("productIds must be a non-empty array"),
  body("productIds.*")
    .isMongoId()
    .withMessage("Each item in productIds must be a valid Mongo ID"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Draft", "Pending Review", "Published", "Archived", "Out Of Stock"])
    .withMessage("Invalid status value"),
  validateMiddleware,
];

exports.validateBulkDelete = [
  body("productIds")
    .isArray({ min: 1 })
    .withMessage("productIds must be a non-empty array"),
  body("productIds.*")
    .isMongoId()
    .withMessage("Each item in productIds must be a valid Mongo ID"),
  validateMiddleware,
];

exports.validateBulkStock = [
  body("adjustments")
    .isArray({ min: 1 })
    .withMessage("adjustments must be a non-empty array of objects"),
  body("adjustments.*.productId")
    .isMongoId()
    .withMessage("Each adjustment must specify a valid product Mongo ID"),
  body("adjustments.*.quantity")
    .isInt()
    .withMessage("Each adjustment quantity must be an integer"),
  validateMiddleware,
];

exports.validateBulkPrice = [
  body("updates")
    .isArray({ min: 1 })
    .withMessage("updates must be a non-empty array of objects"),
  body("updates.*.productId")
    .isMongoId()
    .withMessage("Each update must specify a valid product Mongo ID"),
  body("updates.*.price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Base price must be a positive float"),
  body("updates.*.discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive float"),
  validateMiddleware,
];

exports.validateBulkCategory = [
  body("productIds")
    .isArray({ min: 1 })
    .withMessage("productIds must be a non-empty array"),
  body("productIds.*")
    .isMongoId()
    .withMessage("Each item in productIds must be a valid Mongo ID"),
  body("categoryId")
    .isMongoId()
    .withMessage("categoryId must be a valid Mongo ID"),
  validateMiddleware,
];

exports.validateBulkDiscounts = [
  body("productIds")
    .isArray({ min: 1 })
    .withMessage("productIds must be a non-empty array"),
  body("productIds.*")
    .isMongoId()
    .withMessage("Each item in productIds must be a valid Mongo ID"),
  body("discountPercentage")
    .isFloat({ min: 0, max: 100 })
    .withMessage("discountPercentage must be a float between 0 and 100"),
  validateMiddleware,
];
