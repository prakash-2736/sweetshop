const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, authorize } = require("../../../middlewares/auth");

router.use(authenticate);

// User & Admin common endpoints
router.post("/", orderController.place);
router.post("/confirm-payment", orderController.confirmPayment);
router.get("/my-orders", orderController.getMyOrders);
router.get("/:orderId", orderController.getDetails);
router.get("/:orderId/invoice", orderController.downloadInvoice);
router.post("/:orderId/cancel", orderController.cancel);
router.post("/:orderId/return", orderController.requestReturn);

// Admin-only dashboard endpoints
router.get("/admin/orders", authorize("admin"), orderController.getAdminOrders);
router.patch("/admin/:orderId/status", authorize("admin"), orderController.updateStatus);
router.post("/admin/:orderId/process-return", authorize("admin"), orderController.processReturn);

// Admin analytics endpoints
router.get("/admin/analytics/revenue", authorize("admin"), orderController.getRevenueStats);
router.get("/admin/analytics/top-customers", authorize("admin"), orderController.getTopCustomers);
router.get("/admin/analytics/metrics", authorize("admin"), orderController.getGeneralMetrics);

module.exports = router;
