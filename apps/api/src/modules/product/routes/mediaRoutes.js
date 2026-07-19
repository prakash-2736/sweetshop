const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController");
const { uploadImages } = require("../middlewares/upload");
const { authenticate, authorize } = require("../../../middlewares/auth");

// Admin-only endpoints
router.use(authenticate);
router.use(authorize("admin"));

router.post("/:productId/images", uploadImages, mediaController.upload);
router.delete("/:productId/images/:imageId", mediaController.delete);

module.exports = router;
