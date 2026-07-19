const ApiResponse = require("../utils/response");

// Mock Orders data
const MOCK_ORDERS = [
  {
    id: "SW-872910",
    customer: "Prakash Raj",
    date: "2026-07-15",
    status: "Delivered",
    total: 672,
    items: [
      { name: "Ghee Roasted Murukulu", qty: 1, price: 150 },
      { name: "Dry Fruit Filled Kaju Katli", qty: 1, price: 650 }
    ]
  },
  {
    id: "SW-321092",
    customer: "Prakash Raj",
    date: "2026-06-28",
    status: "Delivered",
    total: 450,
    items: [
      { name: "Bandar Laddu", qty: 1, price: 450 }
    ]
  }
];

exports.getOrders = (req, res) => {
  return ApiResponse.success(res, 200, "Orders fetched successfully", MOCK_ORDERS);
};
