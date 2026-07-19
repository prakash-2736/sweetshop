const { body, param } = require("express-validator");
const validateMiddleware = require("../../../middlewares/validate");

exports.validateAdjustStock = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID path parameter"),
  body("quantity")
    .notEmpty()
    .withMessage("Stock adjustment quantity is required")
    .isInt()
    .withMessage("Quantity must be an integer (positive or negative)"),
  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Remarks cannot exceed 200 characters"),
  validateMiddleware,
];
