"use client";

import { useEffect, useState, useMemo } from "react";
import { useCartStore } from "../store/cartStore";

export function useCart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Recalculate totals on mount to verify local storage load
    useCartStore.getState().calculateTotals();
  }, []);

  const cart = useCartStore((state) => state.cart);
  const activeCoupon = useCartStore((state) => state.activeCoupon);
  const shippingPincode = useCartStore((state) => state.shippingPincode);
  const estimatedDeliveryDays = useCartStore((state) => state.estimatedDeliveryDays);
  const shippingCost = useCartStore((state) => state.shippingCost);
  const totals = useCartStore((state) => state.totals);

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const estimateShipping = useCartStore((state) => state.estimateShipping);

  // Computed count of items in cart
  const count = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  return {
    // States (SSR-safe wrapper protection)
    cart: mounted ? cart : [],
    activeCoupon: mounted ? activeCoupon : null,
    shippingPincode: mounted ? shippingPincode : "",
    estimatedDeliveryDays: mounted ? estimatedDeliveryDays : null,
    shippingCost: mounted ? shippingCost : 0,
    totals: mounted ? totals : { subtotal: 0, discount: 0, couponDiscount: 0, shippingCharge: 0, tax: 0, grandTotal: 0 },
    count: mounted ? count : 0,
    isMounted: mounted,

    // Actions
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    estimateShipping,

    // Backward compatibility aliases
    addToCart: addItem,
    removeFromCart: removeItem,
    subtotal: mounted ? totals.subtotal : 0,
  };
}
export default useCart;
