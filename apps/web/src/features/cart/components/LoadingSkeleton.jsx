"use client";

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
      {/* Items list shimmer */}
      <div className="lg:col-span-8 space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 bg-white border border-stone-200/50 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 h-[120px]"
          >
            <div className="flex gap-4 items-center flex-1 w-full">
              <div className="w-20 h-20 bg-stone-100 rounded-2xl flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4.5 bg-stone-100 rounded-md w-3/5" />
                <div className="h-3 bg-stone-100 rounded-md w-2/5" />
              </div>
            </div>
            <div className="w-24 h-9 bg-stone-100 rounded-xl" />
            <div className="w-20 h-5 bg-stone-100 rounded-md" />
            <div className="w-16 h-8 bg-stone-100 rounded-md" />
          </div>
        ))}
      </div>

      {/* Summary card shimmer */}
      <div className="lg:col-span-4 bg-white p-6 rounded-[32px] border border-stone-200/50 space-y-6 h-[400px]">
        <div className="h-5 bg-stone-100 rounded-md w-1/3" />
        <div className="space-y-3 pt-2">
          <div className="flex justify-between">
            <div className="h-4 bg-stone-100 rounded-md w-1/4" />
            <div className="h-4 bg-stone-100 rounded-md w-1/5" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-stone-100 rounded-md w-1/4" />
            <div className="h-4 bg-stone-100 rounded-md w-1/5" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-stone-100 rounded-md w-1/4" />
            <div className="h-4 bg-stone-100 rounded-md w-1/5" />
          </div>
        </div>
        <hr className="border-stone-100" />
        <div className="h-12 bg-stone-100 rounded-2xl w-full" />
      </div>
    </div>
  );
}
