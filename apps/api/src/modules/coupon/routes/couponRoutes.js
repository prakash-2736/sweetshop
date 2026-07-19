const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const { authenticate, authorize } = require("../../../middlewares/auth");

// Public/User endpoints (optional authenticate to fetch personal coupons or validate)
router.post("/validate", authenticate, couponController.validate);
router.get("/", authenticate, couponController.getAll);

// Admin-only endpoints
router.post("/", authenticate, authorize("admin"), couponController.create);
router.put("/:id", authenticate, authorize("admin"), couponController.update);
router.delete("/:id", authenticate, authorize("admin"), couponController.delete);

module.exports = router;
