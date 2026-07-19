const couponService = require("../services/couponService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");

class CouponController {
  async create(req, res, next) {
    try {
      const coupon = await couponService.createCoupon(req.body);
      return ApiResponse.success(res, HTTP_STATUS.CREATED, "Coupon created successfully", coupon);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Coupon updated successfully", coupon);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await couponService.deleteCoupon(req.params.id);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Coupon deleted successfully");
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page, limit } = req.query;
      const isAdmin = req.user && req.user.role === "admin";
      
      const result = await couponService.getCoupons({
        page,
        limit,
        activeOnly: !isAdmin, // Users only get active ones
      });

      return ApiResponse.success(res, HTTP_STATUS.OK, "Coupons fetched successfully", result);
    } catch (err) {
      next(err);
    }
  }

  async validate(req, res, next) {
    try {
      const { code, amount } = req.body;
      const validationResult = await couponService.validateCoupon(code, amount);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Coupon is valid", validationResult);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CouponController();
