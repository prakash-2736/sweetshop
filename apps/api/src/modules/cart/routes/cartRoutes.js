const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticate } = require("../../../middlewares/auth");

router.use(authenticate);

router.get("/", cartController.get);
router.post("/", cartController.add);
router.put("/quantity", cartController.updateQuantity);
router.delete("/", cartController.remove);
router.post("/merge", cartController.merge);

module.exports = router;
