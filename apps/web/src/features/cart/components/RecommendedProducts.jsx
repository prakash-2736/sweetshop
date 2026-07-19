"use client";

import { useMemo } from "react";
import { PRODUCTS_DATA, ProductCard } from "@/features/products";

export default function RecommendedProducts({ cartItems }) {
  // Select 4 items not already in the cart to recommend
  const recommendations = useMemo(() => {
    const cartIds = new Set(cartItems.map((item) => item.id));
    const filtered = PRODUCTS_DATA.filter((p) => !cartIds.has(p.id) && p.stock > 0);
    
    // Fallback if cart has everything, just show any 4 in stock
    if (filtered.length < 4) {
      return PRODUCTS_DATA.filter((p) => p.stock > 0).slice(0, 4);
    }
    
    return filtered.slice(0, 4);
  }, [cartItems]);

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 tracking-tight">
          Recommended Sweets For You
        </h2>
        <span className="text-xs text-muted-foreground font-semibold">Customers also bought</span>
      </div>

      {/* Horizontal scroll grid */}
      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent">
        {recommendations.map((product) => (
          <div key={product.id} className="min-w-[280px] sm:min-w-[300px] w-[300px] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
