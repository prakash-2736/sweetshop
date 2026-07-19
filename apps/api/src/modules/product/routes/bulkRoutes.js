const express = require("express");
const router = express.Router();
const bulkController = require("../controllers/bulkController");
const bulkValidator = require("../validators/bulkValidator");
const { authenticate, authorize } = require("../../../middlewares/auth");

// Admin-only endpoints
router.use(authenticate);
router.use(authorize("admin"));

router.patch("/status", bulkValidator.validateBulkStatus, bulkController.updateStatus);
router.post("/delete", bulkValidator.validateBulkDelete, bulkController.softDelete);
router.patch("/stock", bulkValidator.validateBulkStock, bulkController.updateStock);
router.patch("/price", bulkValidator.validateBulkPrice, bulkController.updatePrices);
router.patch("/reassign-category", bulkValidator.validateBulkCategory, bulkController.reassignCategory);
router.patch("/discounts", bulkValidator.validateBulkDiscounts, bulkController.applyDiscounts);

module.exports = router;
