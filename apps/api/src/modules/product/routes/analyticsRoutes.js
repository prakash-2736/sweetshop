const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const { authenticate, authorize } = require("../../../middlewares/auth");

// Admin-only endpoints
router.use(authenticate);
router.use(authorize("admin"));

router.get("/stock-summary", analyticsController.getStockSummary);
router.get("/category-metrics", analyticsController.getCategoryMetrics);
router.get("/dashboard-summary", analyticsController.getDashboardSummary);

module.exports = router;
