const express = require("express");
const router = express.Router();

// Controllers & Routes
const apiController = require("../controllers/apiController");
const userController = require("../controllers/userController");
const authRoutes = require("./authRoutes");
const productModuleRoutes = require("../modules/product/routes");

// Commerce modules routes
const cartRoutes = require("../modules/cart/routes/cartRoutes");
const wishlistRoutes = require("../modules/wishlist/routes/wishlistRoutes");
const couponRoutes = require("../modules/coupon/routes/couponRoutes");
const checkoutRoutes = require("../modules/checkout/routes/checkoutRoutes");
const orderRoutes = require("../modules/order/routes/orderRoutes");
const webhookRoutes = require("../modules/webhook/routes/webhookRoutes");

// Base endpoints
router.get("/", apiController.getRoot);
router.get("/health", apiController.getHealth);

// Version 1 endpoints
router.get("/api/v1", apiController.getV1Root);
router.use("/api/v1/auth", authRoutes);

// Mount product module routes (products, categories, inventory, media, bulk, csv, analytics)
router.use("/api/v1", productModuleRoutes);

// Mount commerce engine routes
router.use("/api/v1/cart", cartRoutes);
router.use("/api/v1/wishlist", wishlistRoutes);
router.use("/api/v1/coupons", couponRoutes);
router.use("/api/v1/checkout", checkoutRoutes);
router.use("/api/v1/orders", orderRoutes);
router.use("/api/v1/webhooks", webhookRoutes);

// Mock endpoints
router.get("/api/v1/users", userController.getUsers);

module.exports = router;


