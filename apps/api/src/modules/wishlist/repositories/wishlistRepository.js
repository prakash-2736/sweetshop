const Wishlist = require("../../../models/Wishlist");

class WishlistRepository {
  async findByUserId(userId, options = {}) {
    let query = Wishlist.findOne({ user: userId });
    if (options.populateProducts) {
      query = query.populate("products", "name slug price discountPrice weight stock status images rating sweetType");
    }
    if (options.lean) {
      query = query.lean();
    }
    return query.exec();
  }

  async create(data) {
    const wishlist = new Wishlist(data);
    return wishlist.save();
  }

  async addProduct(userId, productId) {
    return Wishlist.findOneAndUpdate(
      { user: userId },
      { $addToSet: { products: productId } },
      { new: true, upsert: true }
    );
  }

  async removeProduct(userId, productId) {
    return Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } },
      { new: true }
    );
  }
}

module.exports = new WishlistRepository();
