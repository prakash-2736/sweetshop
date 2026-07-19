"use client";

import { PRODUCTS } from "../data";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  return (
    <section className="py-16 md:py-24 bg-stone-50/50 border-t border-b">
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Featured Sweet Delights
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Curated from our finest daily batches. Taste the heritage of Atreyapuram and Kakinada in every single bite.
            </p>
          </div>
        </div>

        {/* 8 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {PRODUCTS.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
