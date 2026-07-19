import { create } from "zustand";
import { persist } from "zustand/middleware";

const DUMMY_COUPONS = {
  WELCOME10: 0.10, // 10% Off
  SWEET20: 0.20,   // 20% Off
  FESTIVE50: 0.50, // 50% Off
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      activeCoupon: null, // { code: "WELCOME10", discountPercent: 0.10 }
      shippingPincode: "",
      estimatedDeliveryDays: null,
      shippingCost: 0,

      // Add item to cart
      addItem: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === product.id);
        const maxStock = product.stock !== undefined ? product.stock : 99;

        if (existingItem) {
          const newQty = Math.min(existingItem.quantity + quantity, maxStock);
          set({
            cart: cart.map((item) =>
              item.id === product.id ? { ...item, quantity: newQty } : item
            ),
          });
        } else {
          const initialQty = Math.min(quantity, maxStock);
          set({
            cart: [...cart, { ...product, quantity: initialQty }],
          });
        }
        get().calculateTotals();
      },

      // Remove item
      removeItem: (id) => {
        set({
          cart: get().cart.filter((item) => item.id !== id),
        });
        get().calculateTotals();
      },

      // Increment
      increaseQuantity: (id) => {
        const { cart } = get();
        const item = cart.find((i) => i.id === id);
        if (item) {
          const maxStock = item.stock !== undefined ? item.stock : 99;
          const newQty = Math.min(item.quantity + 1, maxStock);
          set({
            cart: cart.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)),
          });
        }
        get().calculateTotals();
      },

      // Decrement
      decreaseQuantity: (id) => {
        const { cart } = get();
        const item = cart.find((i) => i.id === id);
        if (item && item.quantity > 1) {
          set({
            cart: cart.map((i) => (i.id === id ? { ...i, quantity: item.quantity - 1 } : i)),
          });
        }
        get().calculateTotals();
      },

      // Update quantity manually
      updateQuantity: (id, quantity) => {
        const { cart } = get();
        const item = cart.find((i) => i.id === id);
        if (item) {
          const maxStock = item.stock !== undefined ? item.stock : 99;
          const cleanQty = Math.max(1, Math.min(quantity, maxStock));
          set({
            cart: cart.map((i) => (i.id === id ? { ...i, quantity: cleanQty } : i)),
          });
        }
        get().calculateTotals();
      },

      // Clear all items
      clearCart: () => {
        set({
          cart: [],
          activeCoupon: null,
          shippingPincode: "",
          estimatedDeliveryDays: null,
          shippingCost: 0,
        });
      },

      // Apply coupon
      applyCoupon: (code) => {
        const upperCode = code.toUpperCase().trim();
        const discountPercent = DUMMY_COUPONS[upperCode];

        if (discountPercent !== undefined) {
          set({
            activeCoupon: { code: upperCode, discountPercent },
          });
          get().calculateTotals();
          return { success: true, message: `Coupon "${upperCode}" applied successfully!` };
        }

        return { success: false, message: "Invalid coupon code." };
      },

      // Remove coupon
      removeCoupon: () => {
        set({ activeCoupon: null });
        get().calculateTotals();
      },

      // Shipping estimation
      estimateShipping: (pincode) => {
        if (!/^\d{6}$/.test(pincode.trim())) {
          return { success: false, message: "Please enter a valid 6-digit Pincode." };
        }
        
        // Simulating different dates/costs based on pincode ranges
        const digit = parseInt(pincode.charAt(0), 10);
        let deliveryDays = 3;
        let cost = 50;

        if (digit === 5) {
          // South India (AP/Telangana)
          deliveryDays = 1;
          cost = 30;
        } else if (digit === 1 || digit === 2) {
          // North India
          deliveryDays = 4;
          cost = 60;
        }

        set({
          shippingPincode: pincode,
          estimatedDeliveryDays: deliveryDays,
          shippingCost: cost,
        });
        
        get().calculateTotals();
        return { success: true, message: `Shipping calculated for pincode ${pincode}` };
      },

      // Totals calculations
      totals: {
        subtotal: 0,
        discount: 0,
        couponDiscount: 0,
        shippingCharge: 0,
        tax: 0,
        grandTotal: 0,
      },

      calculateTotals: () => {
        const { cart, activeCoupon, shippingCost } = get();

        // Subtotal (using discountPrice as operational cart price)
        const subtotal = cart.reduce((acc, item) => acc + item.discountPrice * item.quantity, 0);

        // Saved discount (original price - discountPrice)
        const discount = cart.reduce(
          (acc, item) => acc + (item.price - item.discountPrice) * item.quantity,
          0
        );

        // Coupon discount
        const couponDiscount = activeCoupon
          ? Math.round(subtotal * activeCoupon.discountPercent)
          : 0;

        // Shipping charge: free above ₹500 after coupon discount
        const netTotal = subtotal - couponDiscount;
        const shippingCharge = netTotal >= 500 || netTotal <= 0 ? 0 : shippingCost || 50;

        // Tax (approx. 5% GST on sweets)
        const tax = Math.round(netTotal * 0.05);

        // Grand Total
        const grandTotal = netTotal + shippingCharge + tax;

        set({
          totals: {
            subtotal,
            discount,
            couponDiscount,
            shippingCharge,
            tax,
            grandTotal,
          },
        });
      },
    }),
    {
      name: "sweetshop-cart-v2", // Unique key in localStorage
      partialize: (state) => ({
        cart: state.cart,
        activeCoupon: state.activeCoupon,
        shippingPincode: state.shippingPincode,
        estimatedDeliveryDays: state.estimatedDeliveryDays,
        shippingCost: state.shippingCost,
      }),
    }
  )
);
