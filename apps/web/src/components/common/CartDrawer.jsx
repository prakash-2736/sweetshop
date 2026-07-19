"use client";

// Re-export the features-based MiniCart to preserve global layout positioning
import MiniCart from "@/features/cart/components/MiniCart";

export default function CartDrawer() {
  return <MiniCart />;
}
