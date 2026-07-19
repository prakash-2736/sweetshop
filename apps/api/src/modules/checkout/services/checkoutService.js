const cartService = require("../../cart/services/cartService");
const couponService = require("../../coupon/services/couponService");
const taxShippingService = require("../../shipping/services/taxShippingService");
const User = require("../../../models/User");

class CheckoutService {
  /**
   * Previews checkout calculations before final order submission
   */
  async reviewCheckout(userId, { addressId, couponCode }) {
    // 1. Get validated cart
    const { cart, subtotal } = await cartService.getCart(userId);
    if (cart.items.length === 0) {
      throw { status: 400, message: "Your shopping cart is empty" };
    }

    // 2. Resolve Shipping Address
    const user = await User.findById(userId).lean();
    if (!user) {
      throw { status: 404, message: "User profile not found" };
    }

    let shippingAddress = null;
    if (addressId) {
      shippingAddress = user.addresses.find((addr) => addr._id.toString() === addressId);
    } else {
      // Fall back to default address
      shippingAddress = user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
    }

    if (!shippingAddress) {
      throw { status: 400, message: "Please specify a valid shipping address" };
    }

    // 3. Calculate Weight (abstract extraction)
    let totalWeightKg = 0.5;
    cart.items.forEach((item) => {
      // Extract numerical value from string e.g. "500g" or "1kg"
      const wStr = item.selectedWeight || "";
      if (wStr.includes("kg")) {
        totalWeightKg += parseFloat(wStr) * item.quantity;
      } else if (wStr.includes("g")) {
        totalWeightKg += (parseFloat(wStr) / 1000) * item.quantity;
      }
    });

    // 4. Calculate Tax & Shipping
    const tax = taxShippingService.calculateTax(subtotal);
    const shippingCharge = taxShippingService.calculateShipping(subtotal, totalWeightKg, shippingAddress.state);

    // 5. Evaluate Coupon
    let discount = 0;
    let couponApplied = null;

    if (couponCode) {
      try {
        const couponVal = await couponService.validateCoupon(couponCode, subtotal);
        discount = couponVal.discountAmount;
        couponApplied = couponVal.code;
      } catch (err) {
        // Fail validation but allow client to know why, or throw error depending on strictness
        throw { status: 400, message: `Coupon validation failed: ${err.message}` };
      }
    }

    const total = Number((subtotal + tax + shippingCharge - discount).toFixed(2));

    return {
      items: cart.items,
      shippingAddress,
      subtotal,
      discount,
      shippingCharge,
      tax,
      total,
      couponApplied,
    };
  }
}

module.exports = new CheckoutService();
