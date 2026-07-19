const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const inventoryValidator = require("../validators/inventoryValidator");
const { authenticate, authorize } = require("../../../middlewares/auth");

// Admin-only endpoints
router.use(authenticate);
router.use(authorize("admin"));

router.get("/low-stock", inventoryController.getLowStock);
router.get("/history", inventoryController.getHistory);
router.get("/:productId", inventoryController.getByProductId);
router.post(
  "/:productId/adjust",
  inventoryValidator.validateAdjustStock,
  inventoryController.adjustStock
);

module.exports = router;
