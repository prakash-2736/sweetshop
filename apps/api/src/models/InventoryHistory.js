const mongoose = require("mongoose");

const InventoryHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
      index: true,
    },
    changeType: {
      type: String,
      enum: ["INWARD", "OUTWARD", "RESERVED", "RELEASED", "ADJUSTMENT"],
      required: [true, "Stock change type is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity change is required"],
    },
    previousStock: {
      type: Number,
      required: [true, "Previous stock level is required"],
    },
    newStock: {
      type: Number,
      required: [true, "New stock level is required"],
    },
    referenceType: {
      type: String,
      enum: ["ORDER", "PURCHASE_ORDER", "MANUAL_ADJUSTMENT", "RETURN"],
      default: "MANUAL_ADJUSTMENT",
    },
    referenceId: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User performing action is required"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only log when it was created
  }
);

module.exports = mongoose.model("InventoryHistory", InventoryHistorySchema);
