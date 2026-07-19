"use client";

import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search for sweets, savories..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-stone-200 pl-11 pr-10 py-2.5 rounded-2xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder-stone-400 shadow-xs"
      />
      <Search className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-3.5 text-stone-400 hover:text-stone-700 cursor-pointer"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
