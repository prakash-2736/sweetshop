const cartService = require("../services/cartService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");

class CartController {
  async get(req, res, next) {
    try {
      const data = await cartService.getCart(req.user.id);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Cart fetched successfully", data);
    } catch (err) {
      next(err);
    }
  }

  async add(req, res, next) {
    try {
      const data = await cartService.addToCart(req.user.id, req.body);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Item added to cart successfully", data);
    } catch (err) {
      next(err);
    }
  }

  async updateQuantity(req, res, next) {
    try {
      const data = await cartService.updateItemQuantity(req.user.id, req.body);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Cart item quantity updated successfully", data);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const { productId, selectedWeight } = req.query;
      const data = await cartService.removeFromCart(req.user.id, productId, selectedWeight);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Item removed from cart successfully", data);
    } catch (err) {
      next(err);
    }
  }

  async merge(req, res, next) {
    try {
      const { items } = req.body;
      const data = await cartService.mergeCart(req.user.id, items || []);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Guest cart merged successfully", data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CartController();
