"use client";

import { CATEGORIES } from "@/constants/products";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function ProductFilter({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange
}) {
  return (
    <div className="flex flex-col gap-4 py-4 border-b border-border/60">
      {/* Mobile-friendly Horizontal Category Scroller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer",
                  isSelected
                    ? "bg-amber-500 text-stone-950 scale-105"
                    : "bg-muted text-muted-foreground hover:bg-amber-50 hover:text-amber-800"
                )}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center justify-end gap-3 self-end sm:self-auto">
          <div className="relative inline-flex items-center bg-muted border border-border/80 px-3.5 py-2 rounded-xl text-xs font-bold text-muted-foreground focus-within:ring-1 focus-within:ring-amber-500 focus-within:bg-background transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent pr-6 focus:outline-none appearance-none cursor-pointer text-stone-850 font-bold"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating: Highest First</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 pointer-events-none text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
