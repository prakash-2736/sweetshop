/**
 * Filters the products array based on active filters
 * @param {Array} products 
 * @param {Object} filters 
 * @param {string} filters.category 
 * @param {Array} filters.priceRange - [min, max]
 * @param {number} filters.rating 
 * @param {boolean} filters.availability 
 * @param {string} filters.searchQuery 
 * @returns {Array} filtered products
 */
export function filterProducts(products, filters) {
  return products.filter((product) => {
    // Search Query Filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(query);
      const matchDesc = product.description.toLowerCase().includes(query);
      if (!matchName && !matchDesc) return false;
    }

    // Category Filter (support slugs matching category names)
    if (filters.category && filters.category !== "all") {
      const normalizedCategory = filters.category.toLowerCase().replace(/-/g, " ");
      const normalizedProductCat = product.category.toLowerCase();
      
      // matches e.g. "traditional sweets" and "traditional-sweets"
      if (!normalizedProductCat.includes(normalizedCategory) && !normalizedCategory.includes(normalizedProductCat)) {
        return false;
      }
    }

    // Price Range Filter (using discountPrice as active price)
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (product.discountPrice < min || product.discountPrice > max) {
        return false;
      }
    }

    // Rating Filter (greater than or equal to selected minimum rating)
    if (filters.rating && filters.rating > 0) {
      if (product.rating < filters.rating) {
        return false;
      }
    }

    // Availability Filter (if true, only show in-stock products)
    if (filters.availability) {
      if (product.stock <= 0) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts the products array
 * @param {Array} products 
 * @param {string} sortBy 
 * @returns {Array} sorted products
 */
export function sortProducts(products, sortBy) {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low-to-high":
      return sorted.sort((a, b) => a.discountPrice - b.discountPrice);
    case "price-high-to-low":
      return sorted.sort((a, b) => b.discountPrice - a.discountPrice);
    case "highest-rated":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "most-popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "newest":
    default:
      // Simulating newest by ID comparison (e.g. p24 is newer than p1)
      return sorted.sort((a, b) => {
        const idA = parseInt(a.id.replace("p", ""), 10);
        const idB = parseInt(b.id.replace("p", ""), 10);
        return idB - idA;
      });
  }
}
