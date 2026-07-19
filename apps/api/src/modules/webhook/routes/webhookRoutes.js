const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhookController");

// Public webhook route (signature-verified internally)
router.post("/razorpay", express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }), webhookController.handleRazorpay);

module.exports = router;
