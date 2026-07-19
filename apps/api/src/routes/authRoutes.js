const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");
const { authenticate } = require("../middlewares/auth");

// Public authentication routes
router.post("/register", authValidator.validateRegister, authController.register);
router.post("/login", authValidator.validateLogin, authController.login);
router.post("/refresh-token", authValidator.validateRefreshToken, authController.refreshToken);

// Protected authentication routes
router.post("/logout", authenticate, authController.logout);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authValidator.validateUpdateProfile, authController.updateProfile);
router.put("/change-password", authenticate, authValidator.validateChangePassword, authController.changePassword);

module.exports = router;
