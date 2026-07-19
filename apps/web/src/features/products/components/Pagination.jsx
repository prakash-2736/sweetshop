"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {/* Prev button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
          currentPage === 1
            ? "border-stone-100 text-stone-300 cursor-not-allowed"
            : "border-stone-200 bg-white hover:bg-stone-50 text-stone-700 active:scale-95"
        }`}
        title="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pages.map((p) => {
          const isSelected = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-amber-500 border-amber-500 text-stone-950 shadow-xs"
                  : "border-stone-200 bg-white hover:bg-stone-50 text-stone-700 active:scale-95"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
          currentPage === totalPages
            ? "border-stone-100 text-stone-300 cursor-not-allowed"
            : "border-stone-200 bg-white hover:bg-stone-50 text-stone-700 active:scale-95"
        }`}
        title="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
