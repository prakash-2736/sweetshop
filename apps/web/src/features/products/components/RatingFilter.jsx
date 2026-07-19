"use client";

import { Star } from "lucide-react";

export default function RatingFilter({ value, onChange }) {
  const ratingTiers = [
    { label: "4.8 & Up", minVal: 4.8 },
    { label: "4.5 & Up", minVal: 4.5 },
    { label: "4.0 & Up", minVal: 4.0 },
  ];

  return (
    <div className="space-y-3">
      <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
        Customer Rating
      </h4>
      <div className="space-y-1">
        {/* All option */}
        <button
          onClick={() => onChange(0)}
          className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl transition-all cursor-pointer font-bold ${
            value === 0
              ? "bg-amber-50 text-amber-800"
              : "bg-transparent hover:bg-stone-100 text-stone-605 text-stone-600"
          }`}
        >
          <span>All Ratings</span>
        </button>

        {ratingTiers.map((tier) => {
          const isSelected = value === tier.minVal;
          return (
            <button
              key={tier.minVal}
              onClick={() => onChange(tier.minVal)}
              className={`w-full flex items-center gap-2 text-xs py-2 px-3 rounded-xl transition-all cursor-pointer font-bold ${
                isSelected
                  ? "bg-amber-50 text-amber-800"
                  : "bg-transparent hover:bg-stone-100 text-stone-605 text-stone-600"
              }`}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(tier.minVal)
                        ? "fill-amber-500 text-amber-500"
                        : "text-stone-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px]">{tier.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
