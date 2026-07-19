"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";

/**
 * Custom hook to safely interact with the cart store in client-side components.
 * Prevents hydration mismatches by ensuring cart state is only rendered after mount.
 */
export function useCart() {
  const [mounted, setMounted] = useState(false);
  
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const subtotal = useCartStore((state) => state.getCartSubtotal());
  const count = useCartStore((state) => state.getCartCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    cart: mounted ? cart : [],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal: mounted ? subtotal : 0,
    count: mounted ? count : 0,
    isMounted: mounted,
  };
}
