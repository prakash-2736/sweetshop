const orderService = require("../services/orderService");
const orderAnalyticsService = require("../services/orderAnalyticsService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");
const path = require("path");
const fs = require("fs");

class OrderController {
  async place(req, res, next) {
    try {
      const data = await orderService.placeOrder(req.user.id, req.body);
      return ApiResponse.success(res, HTTP_STATUS.CREATED, "Order initiated successfully", data);
    } catch (err) {
      next(err);
    }
  }

  async confirmPayment(req, res, next) {
    try {
      const order = await orderService.confirmPayment(req.user.id, req.body);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Payment verified and order confirmed", order);
    } catch (err) {
      next(err);
    }
  }

  async getDetails(req, res, next) {
    try {
      const order = await orderService.getOrderDetails(req.params.orderId);
      // Check authorization (either own order or admin)
      if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
        return ApiResponse.error(res, HTTP_STATUS.FORBIDDEN, "Unauthorized to view this order");
      }
      return ApiResponse.success(res, HTTP_STATUS.OK, "Order details fetched successfully", order);
    } catch (err) {
      next(err);
    }
  }

  async getMyOrders(req, res, next) {
    try {
      const { page, limit } = req.query;
      const data = await orderService.getUserOrders(req.user.id, { page, limit });
      return ApiResponse.success(res, HTTP_STATUS.OK, "Orders fetched successfully", data);
    } catch (err) {
      next(err);
    }
  }

  async getAdminOrders(req, res, next) {
    try {
      const { page, limit, status, search } = req.query;
      const data = await orderService.getAdminOrders({ page, limit, status, search });
      return ApiResponse.success(res, HTTP_STATUS.OK, "Admin orders fetched successfully", data);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status, remarks } = req.body;
      const order = await orderService.updateStatus(req.params.orderId, status, { remarks }, req.user.id);
      return ApiResponse.success(res, HTTP_STATUS.OK, `Order status updated to ${status}`, order);
    } catch (err) {
      next(err);
    }
  }

  async cancel(req, res, next) {
    try {
      const { reason } = req.body;
      const order = await orderService.cancelOrder(req.params.orderId, reason, req.user.id);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Order cancelled successfully", order);
    } catch (err) {
      next(err);
    }
  }

  async requestReturn(req, res, next) {
    try {
      const { reason } = req.body;
      const order = await orderService.requestReturn(req.params.orderId, reason, req.user.id);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Return requested successfully", order);
    } catch (err) {
      next(err);
    }
  }

  async processReturn(req, res, next) {
    try {
      const { action, remarks } = req.body;
      const order = await orderService.processReturn(req.params.orderId, { action, remarks }, req.user.id);
      return ApiResponse.success(res, HTTP_STATUS.OK, `Return request ${action.toLowerCase()}`, order);
    } catch (err) {
      next(err);
    }
  }

  async downloadInvoice(req, res, next) {
    try {
      const order = await orderService.getOrderDetails(req.params.orderId);
      if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
        return ApiResponse.error(res, HTTP_STATUS.FORBIDDEN, "Unauthorized to access this invoice");
      }

      if (!order.invoicePath || !fs.existsSync(order.invoicePath)) {
        return ApiResponse.error(res, HTTP_STATUS.NOT_FOUND, "Invoice PDF has not been generated for this order yet");
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=invoice_${order.orderId}.pdf`);
      return res.sendFile(order.invoicePath);
    } catch (err) {
      next(err);
    }
  }

  // Analytics Endpoints
  async getRevenueStats(req, res, next) {
    try {
      const stats = await orderAnalyticsService.getRevenueStats();
      return ApiResponse.success(res, HTTP_STATUS.OK, "Revenue statistics fetched", stats);
    } catch (err) {
      next(err);
    }
  }

  async getTopCustomers(req, res, next) {
    try {
      const { limit } = req.query;
      const stats = await orderAnalyticsService.getTopCustomers({ limit });
      return ApiResponse.success(res, HTTP_STATUS.OK, "Top spending customers fetched", stats);
    } catch (err) {
      next(err);
    }
  }

  async getGeneralMetrics(req, res, next) {
    try {
      const stats = await orderAnalyticsService.getGeneralOrderMetrics();
      return ApiResponse.success(res, HTTP_STATUS.OK, "General order status metrics fetched", stats);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrderController();
