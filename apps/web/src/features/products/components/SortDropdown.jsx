"use client";

export default function SortDropdown({ value, onChange }) {
  const sortOptions = [
    { value: "newest", label: "Newest Arrivals" },
    { value: "price-low-to-high", label: "Price: Low to High" },
    { value: "price-high-to-low", label: "Price: High to Low" },
    { value: "highest-rated", label: "Highest Rated" },
    { value: "most-popular", label: "Most Popular" },
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-by" className="text-xs font-bold text-stone-500 whitespace-nowrap hidden sm:inline">
        Sort By:
      </label>
      <select
        id="sort-by"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-stone-200 text-xs font-bold text-stone-700 px-4.5 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer shadow-xs"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
