const { body, param } = require("express-validator");
const validateMiddleware = require("../../../middlewares/validate");

exports.validateCreateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Must be a valid category Mongo ID"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number")
    .custom((value, { req }) => {
      if (value && parseFloat(value) >= parseFloat(req.body.price)) {
        throw new Error("Discount price must be lower than the base price");
      }
      return true;
    }),
  body("weight")
    .trim()
    .notEmpty()
    .withMessage("Weight is required"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),
  body("lowStockThreshold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Low stock threshold must be a positive integer"),
  body("sweetType")
    .trim()
    .notEmpty()
    .withMessage("Sweet type identifier is required"),
  body("ingredients")
    .optional()
    .isArray()
    .withMessage("Ingredients must be an array of strings"),
  validateMiddleware,
];

exports.validateUpdateProduct = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID path parameter"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("category")
    .optional()
    .trim()
    .isMongoId()
    .withMessage("Must be a valid category Mongo ID"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),
  validateMiddleware,
];

exports.validateUpdateStatus = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID path parameter"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Draft", "Pending Review", "Published", "Archived", "Out Of Stock"])
    .withMessage("Invalid status value"),
  validateMiddleware,
];
