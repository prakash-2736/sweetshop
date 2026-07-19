"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BEST_SELLERS } from "../data";
import ProductCard from "./ProductCard";

export default function BestSellers() {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-stone-50/50 border-t border-b">
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3 max-w-xl text-center sm:text-left">
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              Best Sellers
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The highest-rated sweets preferred by our community of sweet tooths.
            </p>
          </div>

          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 border rounded-2xl bg-white hover:bg-stone-50 active:scale-95 text-stone-600 hover:text-stone-900 transition-all cursor-pointer shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 border rounded-2xl bg-white hover:bg-stone-50 active:scale-95 text-stone-600 hover:text-stone-900 transition-all cursor-pointer shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
        >
          {BEST_SELLERS.map((product) => (
            <div
              key={product.id}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-[280px] lg:min-w-[300px] flex-shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
