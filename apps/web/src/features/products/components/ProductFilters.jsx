"use client";

import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import RatingFilter from "./RatingFilter";
import AvailabilityFilter from "./AvailabilityFilter";
import { FilterX } from "lucide-react";

export default function ProductFilters({
  category,
  priceRange,
  rating,
  availability,
  priceBounds,
  setCategory,
  setPriceRange,
  setRating,
  setAvailability,
  resetFilters,
  isDirty,
}) {
  return (
    <div className="space-y-8 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
      
      {/* Sidebar title with reset option */}
      <div className="flex items-center justify-between pb-4 border-b">
        <span className="font-extrabold text-stone-900 text-sm">Filters</span>
        {isDirty && (
          <button
            onClick={resetFilters}
            className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FilterX className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <CategoryFilter value={category} onChange={setCategory} />

      <hr className="border-stone-100" />

      {/* 2. Price Filter */}
      <PriceFilter value={priceRange} bounds={priceBounds} onChange={setPriceRange} />

      <hr className="border-stone-100" />

      {/* 3. Rating Filter */}
      <RatingFilter value={rating} onChange={setRating} />

      <hr className="border-stone-100" />

      {/* 4. Availability Filter */}
      <AvailabilityFilter value={availability} onChange={setAvailability} />

    </div>
  );
}
