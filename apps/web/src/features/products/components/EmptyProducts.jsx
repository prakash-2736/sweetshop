"use client";

import { EyeOff } from "lucide-react";

export default function EmptyProducts({ onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed rounded-[40px] bg-white space-y-6">
      <div className="p-4 rounded-full bg-amber-50 text-amber-500 border">
        <EyeOff className="w-10 h-10" />
      </div>
      
      <div className="space-y-2 max-w-sm">
        <h3 className="font-extrabold text-stone-900 text-lg">No Sweets Found</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          We couldn't find any products matching your active filters. Try adjusting your price ranges or selecting different categories.
        </p>
      </div>

      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold px-6 py-3 rounded-2xl text-xs shadow-xs transition-all cursor-pointer"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
}
