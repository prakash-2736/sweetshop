"use client";

export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden flex flex-col space-y-4 shadow-xs animate-pulse"
        >
          {/* Image shimmer */}
          <div className="w-full aspect-square bg-stone-100" />
          
          {/* Info Shimmer */}
          <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              {/* Category & Rating */}
              <div className="flex justify-between">
                <div className="h-4 bg-stone-100 rounded-md w-16" />
                <div className="h-4 bg-stone-100 rounded-md w-12" />
              </div>
              
              {/* Name */}
              <div className="h-6 bg-stone-100 rounded-md w-3/4" />
              
              {/* Description */}
              <div className="space-y-1.5">
                <div className="h-3.5 bg-stone-100 rounded-md w-full" />
                <div className="h-3.5 bg-stone-100 rounded-md w-5/6" />
              </div>
            </div>

            {/* Price & Button */}
            <div className="flex justify-between items-center pt-2 border-t mt-auto">
              <div className="space-y-1">
                <div className="h-3 bg-stone-100 rounded-md w-10" />
                <div className="h-5 bg-stone-100 rounded-md w-20" />
              </div>
              <div className="w-10 h-10 bg-stone-100 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
