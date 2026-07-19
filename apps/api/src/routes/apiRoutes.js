const express = require("express");
const router = express.Router();

// Controllers & Routes
const apiController = require("../controllers/apiController");
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const authRoutes = require("./authRoutes");
const productModuleRoutes = require("../modules/product/routes");

// Base endpoints
router.get("/", apiController.getRoot);
router.get("/health", apiController.getHealth);

// Version 1 endpoints
router.get("/api/v1", apiController.getV1Root);
router.use("/api/v1/auth", authRoutes);

// Mount product module routes (products, categories, inventory, media, bulk, csv, analytics)
router.use("/api/v1", productModuleRoutes);

// Mock endpoints
router.get("/api/v1/users", userController.getUsers);
router.get("/api/v1/orders", orderController.getOrders);

module.exports = router;

