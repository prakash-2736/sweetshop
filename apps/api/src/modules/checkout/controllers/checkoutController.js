const checkoutService = require("../services/checkoutService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");

class CheckoutController {
  async review(req, res, next) {
    try {
      const data = await checkoutService.reviewCheckout(req.user.id, req.body);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Checkout reviewed successfully", data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CheckoutController();
