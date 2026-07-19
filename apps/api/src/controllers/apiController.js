const mongoose = require("mongoose");
const ApiResponse = require("../utils/response");

/**
 * Root and Health Check Controllers
 */
exports.getRoot = (req, res) => {
  return ApiResponse.success(res, 200, "SweetShop API Gateway", {
    version: "1.0.0",
    docs: "/api/v1",
    status: "online",
  });
};

exports.getHealth = (req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  
  const readyState = mongoose.connection.readyState;
  const isHealthy = readyState === 1;
  
  const healthData = {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: Date.now(),
    nodeVersion: process.version,
    database: {
      status: states[readyState] || "unknown",
      readyState: readyState
    }
  };
  
  // Return 200 if connected or connecting, otherwise return a degraded status code (503)
  const statusCode = readyState === 1 || readyState === 2 ? 200 : 503;
  
  return ApiResponse.success(
    res,
    statusCode,
    isHealthy ? "System is healthy" : "System is degraded",
    healthData
  );
};

exports.getV1Root = (req, res) => {
  const apiInfo = {
    version: "v1",
    endpoints: {
      products: "/api/v1/products",
      users: "/api/v1/users",
      orders: "/api/v1/orders",
    }
  };
  return ApiResponse.success(res, 200, "SweetShop API v1 Endpoints", apiInfo);
};
