const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const { authenticate } = require("../../../middlewares/auth");

router.use(authenticate);

router.get("/", wishlistController.get);
router.post("/", wishlistController.add);
router.delete("/:productId", wishlistController.remove);
router.post("/move-to-cart", wishlistController.moveToCart);

module.exports = router;
