const inventoryService = require("../services/inventoryService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");

class InventoryController {
  async getByProductId(req, res, next) {
    try {
      const inventory = await inventoryService.getProductInventory(req.params.productId);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Inventory details fetched successfully", inventory);
    } catch (err) {
      next(err);
    }
  }

  async adjustStock(req, res, next) {
    try {
      const { quantity, remarks } = req.body;
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const updated = await inventoryService.adjustStock(
        req.params.productId,
        quantity,
        remarks,
        req.user.id,
        ipAddress
      );
      return ApiResponse.success(res, HTTP_STATUS.OK, "Stock level adjusted successfully", updated);
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req, res, next) {
    try {
      const { productId } = req.query;
      const { page, limit } = req.query;
      const result = await inventoryService.getInventoryHistory(productId, { page, limit });
      return ApiResponse.success(res, HTTP_STATUS.OK, "Inventory stock history logs fetched", result);
    } catch (err) {
      next(err);
    }
  }

  async getLowStock(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await inventoryService.getLowStockItems({ page, limit });
      return ApiResponse.success(res, HTTP_STATUS.OK, "Low stock items detected successfully", result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InventoryController();
