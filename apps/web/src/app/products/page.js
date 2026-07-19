"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductFilter from "@/features/catalog/ProductFilter";
import ProductGrid from "@/features/catalog/ProductGrid";
import { Candy, Loader2 } from "lucide-react";

// Client Catalog Component
function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read state from URL
  const selectedCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  
  // Local state for sorting
  const [sortBy, setSortBy] = useState("featured");

  const handleSelectCategory = (catId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId && catId !== "all") {
      params.set("category", catId);
    } else {
      params.delete("category");
    }
    // Maintain search if existing
    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          {searchQuery ? (
            <>Search results for "{searchQuery}"</>
          ) : (
            <>Explore Our Bakery</>
          )}
        </h1>
        <p className="text-sm text-muted-foreground">
          Indulge in our collection of freshly baked sweets, hand-delivered directly to your home.
        </p>
      </div>

      {/* Catalog Filters */}
      <ProductFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      {/* Product Catalog Grid */}
      <ProductGrid
        category={selectedCategory}
        sortBy={sortBy}
        search={searchQuery}
      />
    </div>
  );
}

// Fallback loader
function CatalogLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <span className="text-xs text-muted-foreground font-semibold">Loading catalog...</span>
      </div>
    </div>
  );
}

// Main page container with Suspense
export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <Suspense fallback={<CatalogLoader />}>
        <CatalogContent />
      </Suspense>
    </div>
  );
}
