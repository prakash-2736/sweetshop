const authService = require("../services/authService");
const userRepository = require("../repositories/userRepository");
const ApiResponse = require("../utils/response");
const { HTTP_STATUS } = require("../constants");

class AuthController {
  /**
   * Register customer account
   */
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      return ApiResponse.success(
        res,
        HTTP_STATUS.CREATED,
        "Registration successful",
        user
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Login customer session
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        "Login successful",
        data
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Invalidate customer session on logout
   */
  async logout(req, res, next) {
    try {
      await authService.logout(req.user.id);
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        "Logout successful"
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetch authenticated user details
   */
  async getProfile(req, res, next) {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        return ApiResponse.error(res, HTTP_STATUS.NOT_FOUND, "User profile not found");
      }
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        "Profile fetched successfully",
        user
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update profile parameters
   */
  async updateProfile(req, res, next) {
    try {
      const updatedUser = await authService.updateProfile(req.user.id, req.body);
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        "Profile updated successfully",
        updatedUser
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Change current account password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user.id, currentPassword, newPassword);
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        "Password changed successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Refresh session tokens
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const data = await authService.refreshSession(refreshToken);
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        "Token refreshed successfully",
        data
      );
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
