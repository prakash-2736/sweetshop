class TaxShippingService {
  /**
   * Calculate GST Tax (e.g. 5% GST for sweets in India)
   * @param {number} subtotal 
   * @returns {number}
   */
  calculateTax(subtotal) {
    const GST_RATE = 0.05; // 5% GST
    return Number((subtotal * GST_RATE).toFixed(2));
  }

  /**
   * Calculate Shipping charges
   * @param {number} subtotal 
   * @param {number} totalWeightKg 
   * @param {string} state 
   * @returns {number}
   */
  calculateShipping(subtotal, totalWeightKg = 0.5, state = "") {
    const FREE_SHIPPING_THRESHOLD = 500; // Free shipping on orders >= ₹500
    
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0;
    }

    // Abstract calculation: base price + weight multiplier + regional charge
    const BASE_SHIPPING = 40;
    const WEIGHT_CHARGE = Math.ceil(totalWeightKg) * 15; // ₹15 per kg
    
    // Add extra for long-distance states (abstract logic)
    const longDistanceStates = ["Kerala", "Tamil Nadu", "Jammu & Kashmir", "Assam", "Sikkim"];
    const regionSurcharge = longDistanceStates.includes(state) ? 30 : 0;

    const charge = BASE_SHIPPING + WEIGHT_CHARGE + regionSurcharge;
    return Number(charge.toFixed(2));
  }
}

module.exports = new TaxShippingService();
