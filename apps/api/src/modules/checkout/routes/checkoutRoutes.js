const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { authenticate } = require("../../../middlewares/auth");

router.use(authenticate);

router.post("/review", checkoutController.review);

module.exports = router;
