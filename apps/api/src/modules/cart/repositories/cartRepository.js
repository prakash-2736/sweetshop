const Cart = require("../../../models/Cart");

class CartRepository {
  async findByUserId(userId, options = {}) {
    let query = Cart.findOne({ user: userId });
    if (options.populateProducts) {
      query = query.populate("items.product", "name slug price discountPrice weight stock status images sweetType isDeleted");
    }
    if (options.lean) {
      query = query.lean();
    }
    return query.exec();
  }

  async create(data, session = null) {
    const cart = new Cart(data);
    return cart.save({ session });
  }

  async update(userId, items, session = null) {
    return Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items } },
      { new: true, runValidators: true, upsert: true, session }
    );
  }

  async clearCart(userId, session = null) {
    return Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true, session }
    );
  }
}

module.exports = new CartRepository();
