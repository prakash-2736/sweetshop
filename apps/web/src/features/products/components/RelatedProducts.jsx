"use client";

import { useMemo } from "react";
import { PRODUCTS_DATA } from "../data";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ currentProduct }) {
  const related = useMemo(() => {
    // Find products in same category, excluding active one
    let filtered = PRODUCTS_DATA.filter(
      (p) => p.category === currentProduct.category && p.id !== currentProduct.id
    );

    // If not enough in same category, fill in from other categories
    if (filtered.length < 4) {
      const extra = PRODUCTS_DATA.filter(
        (p) => p.id !== currentProduct.id && !filtered.find((f) => f.id === p.id)
      );
      filtered = [...filtered, ...extra];
    }

    return filtered.slice(0, 4);
  }, [currentProduct]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
