import { PRODUCTS } from "@/constants/products";

// Simulates network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches all products or filters them by category.
 * @param {string} category 
 * @returns {Promise<Array>}
 */
export async function fetchProducts(category = "") {
  await delay(600);
  if (!category || category === "all" || category === "") {
    return PRODUCTS;
  }
  return PRODUCTS.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

/**
 * Fetches a single product by ID.
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export async function fetchProductById(id) {
  await delay(400);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
}

/**
 * Fetches related products in the same category, excluding the current product.
 * @param {string} category 
 * @param {string} excludeId 
 * @returns {Promise<Array>}
 */
export async function fetchRelatedProducts(category, excludeId) {
  await delay(500);
  return PRODUCTS.filter((p) => p.category === category && p.id !== excludeId).slice(0, 3);
}
