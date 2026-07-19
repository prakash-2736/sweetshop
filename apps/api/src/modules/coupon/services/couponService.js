const couponRepository = require("../repositories/couponRepository");

class CouponService {
  async createCoupon(data) {
    const existing = await couponRepository.findByCode(data.code);
    if (existing) {
      throw { status: 400, message: "Coupon code already exists" };
    }
    return couponRepository.create(data);
  }

  async updateCoupon(id, data) {
    const coupon = await couponRepository.findById(id);
    if (!coupon) {
      throw { status: 404, message: "Coupon not found" };
    }
    if (data.code && data.code.toUpperCase() !== coupon.code) {
      const duplicate = await couponRepository.findByCode(data.code);
      if (duplicate) {
        throw { status: 400, message: "Coupon code already exists" };
      }
    }
    return couponRepository.update(id, data);
  }

  async deleteCoupon(id) {
    const coupon = await couponRepository.findById(id);
    if (!coupon) {
      throw { status: 404, message: "Coupon not found" };
    }
    return couponRepository.delete(id);
  }

  async getCoupons(query) {
    return couponRepository.findAll(query);
  }

  /**
   * Validate and calculate coupon discount
   * @param {string} code 
   * @param {number} purchaseAmount 
   * @returns {object} { discount, finalAmount, code }
   */
  async validateCoupon(code, purchaseAmount) {
    const coupon = await couponRepository.findByCode(code);
    if (!coupon) {
      throw { status: 400, message: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      throw { status: 400, message: "Coupon is inactive" };
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      throw { status: 400, message: "Coupon has expired" };
    }

    if (purchaseAmount < coupon.minPurchase) {
      throw { status: 400, message: `Minimum purchase amount of ₹${coupon.minPurchase} required to apply this coupon` };
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (purchaseAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    }

    // Discount cannot exceed original purchase amount
    discount = Math.min(discount, purchaseAmount);

    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Number(discount.toFixed(2)),
      finalAmount: Number((purchaseAmount - discount).toFixed(2)),
    };
  }
}

module.exports = new CouponService();
