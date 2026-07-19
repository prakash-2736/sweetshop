const http = require("http");
const app = require("./app");
const config = require("./config");
const { connectDB, closeDB } = require("./database/connection");

// Create server instance
const server = http.createServer(app);

// Connect to Database first, then run server
connectDB().then(() => {
  server.listen(config.PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 SweetShop API Server Running`);
    console.log(`Port: ${config.PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
    console.log(`=================================`);
  });
});

// Handle graceful shutdown on SIGINT and SIGTERM
const shutdownGracefully = async (signal) => {
  console.log(`\n📥 Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log("🔒 HTTP server closed.");
    await closeDB();
    console.log("👋 Graceful shutdown complete. Exiting process.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdownGracefully("SIGINT"));
process.on("SIGTERM", () => shutdownGracefully("SIGTERM"));

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message, err.stack);
  server.close(async () => {
    await closeDB();
    process.exit(1);
  });
});
