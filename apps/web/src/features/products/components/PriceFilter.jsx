"use client";

import { formatCurrency } from "@/utils";

export default function PriceFilter({ value, bounds, onChange }) {
  const [minBound, maxBound] = bounds;
  const [currentMin, currentMax] = value;

  const handleSliderChange = (e) => {
    const newMax = parseInt(e.target.value, 10);
    onChange([currentMin, newMax]);
  };

  const presetRanges = [
    { label: "Under ₹300", range: [0, 300] },
    { label: "₹300 - ₹600", range: [300, 600] },
    { label: "Above ₹600", range: [600, maxBound] },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
        Price Range
      </h4>

      {/* Range text */}
      <div className="flex justify-between text-xs text-muted-foreground font-semibold">
        <span>Min: {formatCurrency(currentMin)}</span>
        <span>Max: {formatCurrency(currentMax)}</span>
      </div>

      {/* Slider input for Max Price */}
      <div className="space-y-2">
        <input
          type="range"
          min={minBound}
          max={maxBound}
          value={currentMax}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-stone-150 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-stone-400 font-medium">
          <span>{formatCurrency(minBound)}</span>
          <span>{formatCurrency(maxBound)}</span>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 pt-1">
        {presetRanges.map((preset, idx) => {
          const isSelected = currentMin === preset.range[0] && currentMax === preset.range[1];
          return (
            <button
              key={idx}
              onClick={() => onChange(preset.range)}
              className={`text-[10px] px-3 py-1.5 rounded-full border transition-all cursor-pointer font-bold ${
                isSelected
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-white hover:bg-stone-50 border-stone-200 text-stone-600"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
