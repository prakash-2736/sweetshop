"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS_DATA } from "../data";
import { filterProducts, sortProducts } from "../utils";

const ITEMS_PER_PAGE = 12;

export function useProducts() {
  const searchParams = useSearchParams();

  // Price boundaries computed from mock data
  const priceBounds = useMemo(() => {
    const prices = PRODUCTS_DATA.map((p) => p.discountPrice);
    return [Math.min(...prices), Math.max(...prices)];
  }, []);

  // Sync initial state from URL parameters
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState(priceBounds);
  const [rating, setRating] = useState(0);
  const [availability, setAvailability] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Sync URL search params to local states
  useEffect(() => {
    const urlQuery = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "all";
    
    setSearchQuery(urlQuery);
    setCategory(urlCategory);
    setCurrentPage(1); // Reset page on query/category change
  }, [searchParams]);

  // Handle derived products list
  const { filtered, sorted, paginated, totalPages, totalCount } = useMemo(() => {
    const activeFilters = {
      searchQuery,
      category,
      priceRange,
      rating,
      availability,
    };

    const filteredResult = filterProducts(PRODUCTS_DATA, activeFilters);
    const sortedResult = sortProducts(filteredResult, sortBy);

    // Pagination
    const totalCount = sortedResult.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
    
    // Safety check if current page goes outer bound
    const activePage = Math.min(currentPage, totalPages);
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    const paginatedResult = sortedResult.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      filtered: filteredResult,
      sorted: sortedResult,
      paginated: paginatedResult,
      totalPages,
      totalCount,
    };
  }, [searchQuery, category, priceRange, rating, availability, sortBy, currentPage]);

  const resetFilters = () => {
    setSearchQuery("");
    setCategory("all");
    setPriceRange(priceBounds);
    setRating(0);
    setAvailability(false);
    setSortBy("newest");
    setCurrentPage(1);
  };

  return {
    // States
    searchQuery,
    category,
    priceRange,
    rating,
    availability,
    sortBy,
    currentPage,
    priceBounds,
    
    // State Setters
    setSearchQuery,
    setCategory,
    setPriceRange,
    setRating,
    setAvailability,
    setSortBy,
    setCurrentPage,
    
    // Computed Values
    filteredProducts: sorted,
    paginatedProducts: paginated,
    totalPages,
    totalCount,
    
    // Actions
    resetFilters,
  };
}
