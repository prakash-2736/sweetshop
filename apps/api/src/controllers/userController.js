const ApiResponse = require("../utils/response");

// Mock Users data
const MOCK_USERS = [
  {
    id: "user-1",
    name: "Prakash Raj",
    email: "user@example.com",
    phone: "9876543210",
    role: "user",
    avatar: "PR"
  },
  {
    id: "user-2",
    name: "Admin User",
    email: "admin@sweetshop.com",
    phone: "9999999999",
    role: "admin",
    avatar: "AD"
  }
];

exports.getUsers = (req, res) => {
  return ApiResponse.success(res, 200, "Users fetched successfully", MOCK_USERS);
};
