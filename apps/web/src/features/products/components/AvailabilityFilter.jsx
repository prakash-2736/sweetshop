"use client";

export default function AvailabilityFilter({ value, onChange }) {
  return (
    <div className="space-y-3">
      <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">
        Availability
      </h4>
      <label className="flex items-center gap-3 cursor-pointer py-1.5 select-none">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 text-amber-500 border-stone-300 rounded-sm focus:ring-amber-500 accent-amber-500 cursor-pointer"
        />
        <span className="text-xs font-bold text-stone-700">
          Hide Out of Stock
        </span>
      </label>
    </div>
  );
}
