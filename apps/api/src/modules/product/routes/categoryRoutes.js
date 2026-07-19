const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const categoryValidator = require("../validators/categoryValidator");
const { authenticate, authorize } = require("../../../middlewares/auth");

// Public endpoints
router.get("/", categoryController.getAll);
router.get("/:identifier", categoryController.getByIdOrSlug);

// Admin-only endpoints
router.post(
  "/",
  authenticate,
  authorize("admin"),
  categoryValidator.validateCreateCategory,
  categoryController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  categoryValidator.validateUpdateCategory,
  categoryController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  categoryController.delete
);

module.exports = router;
