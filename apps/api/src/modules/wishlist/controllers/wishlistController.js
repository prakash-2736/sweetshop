const wishlistService = require("../services/wishlistService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");

class WishlistController {
  async get(req, res, next) {
    try {
      const wishlist = await wishlistService.getWishlist(req.user.id);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Wishlist fetched successfully", wishlist);
    } catch (err) {
      next(err);
    }
  }

  async add(req, res, next) {
    try {
      const { productId } = req.body;
      const wishlist = await wishlistService.addToWishlist(req.user.id, productId);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Product added to wishlist successfully", wishlist);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const wishlist = await wishlistService.removeFromWishlist(req.user.id, req.params.productId);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Product removed from wishlist successfully", wishlist);
    } catch (err) {
      next(err);
    }
  }

  async moveToCart(req, res, next) {
    try {
      const result = await wishlistService.moveToCart(req.user.id, req.body);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Moved product to shopping cart successfully", result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new WishlistController();
