const analyticsService = require("../services/analyticsService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");

class AnalyticsController {
  async getStockSummary(req, res, next) {
    try {
      const stats = await analyticsService.getStockSummary();
      return ApiResponse.success(res, HTTP_STATUS.OK, "Stock summary metrics retrieved", stats);
    } catch (err) {
      next(err);
    }
  }

  async getCategoryMetrics(req, res, next) {
    try {
      const metrics = await analyticsService.getCategoryMetrics();
      return ApiResponse.success(res, HTTP_STATUS.OK, "Category product metrics retrieved", metrics);
    } catch (err) {
      next(err);
    }
  }

  async getDashboardSummary(req, res, next) {
    try {
      const summary = await analyticsService.getDashboardSummary();
      return ApiResponse.success(res, HTTP_STATUS.OK, "Overall dashboard summary retrieved", summary);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AnalyticsController();
