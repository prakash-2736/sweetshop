const mongoose = require("mongoose");
const config = require("../config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      autoIndex: true,
    });
    
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    
    // Listen for errors after connection
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB connection disconnected. Attempting reconnect...");
    });
    
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("🛑 MongoDB connection closed gracefully.");
  } catch (err) {
    console.error(`❌ Error closing MongoDB connection: ${err.message}`);
  }
};

module.exports = {
  connectDB,
  closeDB,
  connection: mongoose.connection,
};
