const bulkService = require("../services/bulkService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");

class BulkController {
  async updateStatus(req, res, next) {
    try {
      const { productIds, status } = req.body;
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await bulkService.bulkUpdateStatus(productIds, status, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.OK, `Bulk status updated to ${status} successfully`);
    } catch (err) {
      next(err);
    }
  }

  async softDelete(req, res, next) {
    try {
      const { productIds } = req.body;
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await bulkService.bulkSoftDelete(productIds, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Products soft deleted successfully in bulk");
    } catch (err) {
      next(err);
    }
  }

  async updateStock(req, res, next) {
    try {
      const { adjustments } = req.body; // array of { productId, quantity, remarks }
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await bulkService.bulkUpdateStock(adjustments, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Stocks adjusted successfully in bulk");
    } catch (err) {
      next(err);
    }
  }

  async updatePrices(req, res, next) {
    try {
      const { updates } = req.body; // array of { productId, price, discountPrice }
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await bulkService.bulkUpdatePrices(updates, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Prices updated successfully in bulk");
    } catch (err) {
      next(err);
    }
  }

  async reassignCategory(req, res, next) {
    try {
      const { productIds, categoryId } = req.body;
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await bulkService.bulkReassignCategory(productIds, categoryId, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Products reassigned to new category successfully in bulk");
    } catch (err) {
      next(err);
    }
  }

  async applyDiscounts(req, res, next) {
    try {
      const { productIds, discountPercentage } = req.body;
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await bulkService.bulkApplyDiscounts(productIds, discountPercentage, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Discounts applied successfully in bulk");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BulkController();
