const cartRepository = require("../repositories/cartRepository");
const productRepository = require("../../product/repositories/productRepository");

class CartService {
  async getCart(userId) {
    let cart = await cartRepository.findByUserId(userId, { populateProducts: true });
    
    if (!cart) {
      cart = await cartRepository.create({ user: userId, items: [] });
      return { cart, subtotal: 0, totalItems: 0 };
    }

    // Auto validation: remove deleted/inactive items, adjust quantities to fit available stock
    let updated = false;
    const validatedItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product || product.isDeleted || product.status !== "Published") {
        updated = true;
        continue; // drop item
      }

      if (product.stock === 0) {
        updated = true;
        continue; // drop item
      }

      let quantity = item.quantity;
      if (quantity > product.stock) {
        quantity = product.stock;
        updated = true;
      }

      validatedItems.push({
        product: product._id,
        quantity,
        selectedWeight: item.selectedWeight || product.weight,
      });
    }

    if (updated) {
      cart = await cartRepository.update(userId, validatedItems);
      // Re-fetch populated to return correct values
      cart = await cartRepository.findByUserId(userId, { populateProducts: true });
    }

    // Calculate totals
    let subtotal = 0;
    let totalItems = 0;

    cart.items.forEach((item) => {
      const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
      subtotal += price * item.quantity;
      totalItems += item.quantity;
    });

    return {
      cart,
      subtotal: Number(subtotal.toFixed(2)),
      totalItems,
    };
  }

  async addToCart(userId, { productId, quantity = 1, selectedWeight }) {
    const product = await productRepository.findById(productId);
    if (!product || product.isDeleted || product.status !== "Published") {
      throw { status: 404, message: "Product not found or unavailable" };
    }

    if (product.stock < quantity) {
      throw { status: 400, message: `Only ${product.stock} units available in stock` };
    }

    let cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await cartRepository.create({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.selectedWeight === selectedWeight
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + quantity;
      if (product.stock < newQty) {
        throw { status: 400, message: `Cannot add more. Max stock available is ${product.stock}` };
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        selectedWeight: selectedWeight || product.weight,
      });
    }

    await cart.save();
    return this.getCart(userId);
  }

  async updateItemQuantity(userId, { productId, selectedWeight, quantity }) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId, selectedWeight);
    }

    const product = await productRepository.findById(productId);
    if (!product || product.isDeleted) {
      throw { status: 404, message: "Product not found" };
    }

    if (product.stock < quantity) {
      throw { status: 400, message: `Only ${product.stock} units available in stock` };
    }

    const cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      throw { status: 404, message: "Cart not found" };
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId && item.selectedWeight === selectedWeight
    );

    if (!item) {
      throw { status: 404, message: "Item not found in cart" };
    }

    item.quantity = quantity;
    await cart.save();

    return this.getCart(userId);
  }

  async removeFromCart(userId, productId, selectedWeight) {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      throw { status: 404, message: "Cart not found" };
    }

    cart.items = cart.items.filter(
      (item) => !(item.product.toString() === productId && item.selectedWeight === selectedWeight)
    );

    await cart.save();
    return this.getCart(userId);
  }

  async mergeCart(userId, guestItems) {
    let cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await cartRepository.create({ user: userId, items: [] });
    }

    for (const guestItem of guestItems) {
      const { product: productId, quantity, selectedWeight } = guestItem;
      const product = await productRepository.findById(productId);
      if (!product || product.isDeleted || product.status !== "Published") continue;

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId && item.selectedWeight === selectedWeight
      );

      if (itemIndex > -1) {
        const mergedQty = cart.items[itemIndex].quantity + quantity;
        cart.items[itemIndex].quantity = Math.min(mergedQty, product.stock);
      } else {
        cart.items.push({
          product: productId,
          quantity: Math.min(quantity, product.stock),
          selectedWeight: selectedWeight || product.weight,
        });
      }
    }

    await cart.save();
    return this.getCart(userId);
  }

  async clearCart(userId, session = null) {
    return cartRepository.clearCart(userId, session);
  }
}

module.exports = new CartService();
