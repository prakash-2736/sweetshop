const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const productValidator = require("../validators/productValidator");
const { authenticate, authorize } = require("../../../middlewares/auth");

// Public endpoints
router.get("/", productController.getAll);
router.get("/:identifier", productController.getByIdOrSlug);

// Admin-only endpoints
router.post(
  "/",
  authenticate,
  authorize("admin"),
  productValidator.validateCreateProduct,
  productController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  productValidator.validateUpdateProduct,
  productController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  productController.delete
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  productValidator.validateUpdateStatus,
  productController.updateStatus
);

module.exports = router;
