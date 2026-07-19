const wishlistRepository = require("../repositories/wishlistRepository");
const productRepository = require("../../product/repositories/productRepository");
const cartService = require("../../cart/services/cartService");

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await wishlistRepository.findByUserId(userId, { populateProducts: true });
    if (!wishlist) {
      wishlist = await wishlistRepository.create({ user: userId, products: [] });
    }
    return wishlist;
  }

  async addToWishlist(userId, productId) {
    const product = await productRepository.findById(productId);
    if (!product || product.isDeleted) {
      throw { status: 404, message: "Product not found" };
    }

    await wishlistRepository.addProduct(userId, productId);
    return this.getWishlist(userId);
  }

  async removeFromWishlist(userId, productId) {
    await wishlistRepository.removeProduct(userId, productId);
    return this.getWishlist(userId);
  }

  /**
   * Move item from wishlist to active cart
   */
  async moveToCart(userId, { productId, selectedWeight }) {
    // 1. Remove from Wishlist
    await wishlistRepository.removeProduct(userId, productId);
    
    // 2. Add to Cart
    const updatedCart = await cartService.addToCart(userId, {
      productId,
      quantity: 1,
      selectedWeight,
    });

    return {
      cart: updatedCart,
      wishlist: await this.getWishlist(userId),
    };
  }
}

module.exports = new WishlistService();
