const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    name: {
      type: String,
      required: [true, "Product name at time of order is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Item quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Product price at time of purchase is required"],
      min: [0, "Price cannot be negative"],
    },
    weight: {
      type: String,
      required: [true, "Selected package weight is required"],
    },
  },
  { timestamps: true }
);

module.exports = {
  OrderItemSchema,
  OrderItem: mongoose.model("OrderItem", OrderItemSchema),
};
