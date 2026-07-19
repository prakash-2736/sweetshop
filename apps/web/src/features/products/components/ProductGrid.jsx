"use client";

import ProductCard from "./ProductCard";
import EmptyProducts from "./EmptyProducts";
import LoadingSkeleton from "./LoadingSkeleton";

export default function ProductGrid({ products, isLoading, onClearFilters }) {
  if (isLoading) {
    return <LoadingSkeleton count={8} />;
  }

  if (products.length === 0) {
    return <EmptyProducts onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
