"use client";

import { useMemo } from "react";
import { PRODUCTS_DATA } from "../data";

export default function CategoryFilter({ value, onChange }) {
  // Compute counts dynamically
  const categoriesWithCounts = useMemo(() => {
    const counts = { all: PRODUCTS_DATA.length };
    
    PRODUCTS_DATA.forEach((product) => {
      // Map display name to category slugs for URL alignment
      const slug = product.category.toLowerCase().replace(/ /g, "-");
      counts[slug] = (counts[slug] || 0) + 1;
    });

    return [
      { slug: "all", name: "All Sweets", count: counts.all },
      { slug: "traditional-sweets", name: "Traditional Sweets", count: counts["traditional-sweets"] || 0 },
      { slug: "dry-fruit-sweets", name: "Dry Fruit Sweets", count: counts["dry-fruit-sweets"] || 0 },
      { slug: "milk-sweets", name: "Milk Sweets", count: counts["milk-sweets"] || 0 },
      { slug: "bengali-sweets", name: "Bengali Sweets", count: counts["bengali-sweets"] || 0 },
      { slug: "namkeen", name: "Namkeen", count: counts.namkeen || 0 },
      { slug: "gift-boxes", name: "Gift Boxes", count: counts["gift-boxes"] || 0 },
    ];
  }, []);

  return (
    <div className="space-y-3">
      <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
        Categories
      </h4>
      <div className="space-y-1">
        {categoriesWithCounts.map((cat) => {
          const isSelected = value === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => onChange(cat.slug)}
              className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl transition-all cursor-pointer font-bold ${
                isSelected
                  ? "bg-amber-500 text-stone-950 shadow-xs"
                  : "bg-transparent hover:bg-stone-100 text-stone-605 text-stone-600"
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                isSelected ? "bg-amber-600 text-stone-950" : "bg-stone-100 text-stone-500"
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
