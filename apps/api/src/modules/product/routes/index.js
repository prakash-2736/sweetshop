const express = require("express");
const router = express.Router();

const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const mediaRoutes = require("./mediaRoutes");
const inventoryRoutes = require("./inventoryRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const bulkRoutes = require("./bulkRoutes");
const csvRoutes = require("./csvRoutes");

// Mount sub-routers
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/media", mediaRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/bulk", bulkRoutes);
router.use("/csv", csvRoutes);

module.exports = router;
