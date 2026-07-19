"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/products";
import ProductCard from "@/components/common/ProductCard";
import { ShoppingBag, Loader2 } from "lucide-react";

// Pulse Loader Card for React Query loading state
export function SkeletonCard() {
  return (
    <div className="bg-card border rounded-3xl overflow-hidden p-6 space-y-4 animate-pulse">
      <div className="w-full aspect-square bg-stone-100 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-3.5 bg-stone-150 rounded w-1/4" />
        <div className="h-5 bg-stone-150 rounded w-3/4" />
        <div className="h-3 bg-stone-150 rounded w-full" />
        <div className="h-3 bg-stone-150 rounded w-2/3" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-6 bg-stone-150 rounded w-1/3" />
        <div className="h-10 w-10 bg-stone-150 rounded-full" />
      </div>
    </div>
  );
}

export default function ProductGrid({ category, sortBy, search }) {
  // Query to fetch items
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products", category],
    queryFn: () => fetchProducts(category),
  });

  // Client-side search filtering
  const filteredProducts = products.filter((product) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  });

  // Client-side sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0; // Default Featured sorting (original order)
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 border rounded-3xl bg-rose-50/50 text-rose-800 p-8 max-w-md mx-auto my-6">
        <p className="font-bold text-lg mb-2">Error Loading Sweets</p>
        <p className="text-sm opacity-90">{error.message || "Failed to load product list."}</p>
      </div>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="text-center py-16 px-4 border rounded-3xl bg-muted/30 max-w-md mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-lg text-stone-900 mb-1">No products found</h3>
        <p className="text-xs text-muted-foreground mb-6">
          We couldn't find any sweets matching "{search || category}". Try checking spelling or changing filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {sortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
