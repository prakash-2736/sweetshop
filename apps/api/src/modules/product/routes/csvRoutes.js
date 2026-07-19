const express = require("express");
const router = express.Router();
const csvController = require("../controllers/csvController");
const { uploadCsv } = require("../middlewares/upload");
const { authenticate, authorize } = require("../../../middlewares/auth");

// Admin-only endpoints
router.use(authenticate);
router.use(authorize("admin"));

router.get("/export", csvController.exportCsv);
router.post("/import", uploadCsv, csvController.importCsv);

module.exports = router;
