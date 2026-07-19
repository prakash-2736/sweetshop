"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, ArrowLeft, Loader2 } from "lucide-react";
import {
  useProducts,
  ProductFilters,
  ProductGrid,
  SortDropdown,
  SearchBar,
  Breadcrumbs,
  Pagination
} from "@/features/products";
import { AnimatePresence, motion } from "framer-motion";

function ProductsContent() {
  const router = useRouter();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize filter/sort states from our custom hook
  const {
    searchQuery,
    category,
    priceRange,
    rating,
    availability,
    sortBy,
    currentPage,
    priceBounds,
    setSearchQuery,
    setCategory,
    setPriceRange,
    setRating,
    setAvailability,
    setSortBy,
    setCurrentPage,
    filteredProducts,
    paginatedProducts,
    totalPages,
    totalCount,
    resetFilters,
  } = useProducts();

  // Check if filters have been modified from defaults
  const isDirty =
    category !== "all" ||
    priceRange[0] !== priceBounds[0] ||
    priceRange[1] !== priceBounds[1] ||
    rating !== 0 ||
    availability ||
    searchQuery !== "";

  // Simulate a quick loading effect when filters change
  const handleFilterChange = (setterFn) => {
    return (val) => {
      setIsSearching(true);
      setterFn(val);
      setCurrentPage(1);
      setTimeout(() => setIsSearching(false), 300);
    };
  };

  return (
    <div className="space-y-8">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50/50 py-10 md:py-16 rounded-[32px] border px-6 md:px-12 text-center md:text-left">
        <div className="max-w-2xl space-y-3">
          <Breadcrumbs paths={[]} />
          <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
            Our Andhra Sweet Shop
          </h1>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Freshly prepared traditional recipes containing pure cow ghee, natural jaggery, and premium almonds. Insulated shipping straight to your dining table.
          </p>
        </div>
      </section>

      {/* 2. Controls Row (Search, Sort, Mobile Filter Trigger) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border">
        
        {/* Search */}
        <SearchBar value={searchQuery} onChange={handleFilterChange(setSearchQuery)} />

        {/* Sort & Mobile filter trigger */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex lg:hidden items-center gap-2 px-4.5 py-2.5 bg-stone-900 hover:bg-stone-850 active:scale-95 text-white text-xs font-bold rounded-2xl cursor-pointer transition-all shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Sort selection */}
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* 3. Catalog Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24">
          <ProductFilters
            category={category}
            priceRange={priceRange}
            rating={rating}
            availability={availability}
            priceBounds={priceBounds}
            setCategory={handleFilterChange(setCategory)}
            setPriceRange={handleFilterChange(setPriceRange)}
            setRating={handleFilterChange(setRating)}
            setAvailability={handleFilterChange(setAvailability)}
            resetFilters={resetFilters}
            isDirty={isDirty}
          />
        </aside>

        {/* Products Grid Column */}
        <div className="lg:col-span-9 space-y-8">
          {/* Grid header details */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-stone-500">
              Showing <span className="text-stone-900">{filteredProducts.length}</span> sweets found
            </p>
          </div>

          {/* Product grid */}
          <ProductGrid
            products={paginatedProducts}
            isLoading={isSearching}
            onClearFilters={resetFilters}
          />

          {/* Pagination controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* 4. Mobile Drawer Filters Overlay */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />

            {/* Slide-in sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden shadow-2xl"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <span className="font-extrabold text-stone-900 text-sm">Filters</span>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-stone-50 text-stone-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filters */}
                <ProductFilters
                  category={category}
                  priceRange={priceRange}
                  rating={rating}
                  availability={availability}
                  priceBounds={priceBounds}
                  setCategory={handleFilterChange(setCategory)}
                  setPriceRange={handleFilterChange(setPriceRange)}
                  setRating={handleFilterChange(setRating)}
                  setAvailability={handleFilterChange(setAvailability)}
                  resetFilters={resetFilters}
                  isDirty={isDirty}
                />
              </div>

              {/* Bottom apply trigger */}
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3.5 rounded-2xl text-xs mt-6 cursor-pointer text-center"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

function CatalogFallbackLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <span className="text-xs text-muted-foreground font-semibold">Loading sweet catalog...</span>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <Suspense fallback={<CatalogFallbackLoader />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
