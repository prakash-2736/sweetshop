const ApiResponse = require("../utils/response");

// Mock Products data
const MOCK_PRODUCTS = [
  {
    id: "sweet-1",
    name: "Bellam Putharekulu",
    category: "Traditional Sweets",
    price: 450,
    discountPrice: 399,
    weight: "250g",
    stock: 12,
    rating: 4.8,
  },
  {
    id: "sweet-2",
    name: "Kaju Katli",
    category: "Dry Fruit Sweets",
    price: 650,
    discountPrice: 599,
    weight: "500g",
    stock: 8,
    rating: 4.9,
  },
  {
    id: "sweet-3",
    name: "Ghee Ariselu",
    category: "Traditional Sweets",
    price: 380,
    discountPrice: 320,
    weight: "500g",
    stock: 15,
    rating: 4.7,
  }
];

exports.getProducts = (req, res) => {
  return ApiResponse.success(res, 200, "Products fetched successfully", MOCK_PRODUCTS);
};
