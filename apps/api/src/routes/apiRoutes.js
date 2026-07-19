const express = require("express");
const router = express.Router();

// Controllers & Routes
const apiController = require("../controllers/apiController");
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const authRoutes = require("./authRoutes");

// Base endpoints
router.get("/", apiController.getRoot);
router.get("/health", apiController.getHealth);

// Version 1 endpoints
router.get("/api/v1", apiController.getV1Root);
router.use("/api/v1/auth", authRoutes);

// Mock endpoints
router.get("/api/v1/products", productController.getProducts);
router.get("/api/v1/users", userController.getUsers);
router.get("/api/v1/orders", orderController.getOrders);

module.exports = router;
