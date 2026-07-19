const mongoose = require("mongoose");
const { OrderItemSchema } = require("./OrderItem");
const { AddressSchema } = require("./Address");

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, "Order ID identifier is required"],
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer reference is required"],
    },
    items: [OrderItemSchema],
    shippingAddress: {
      type: AddressSchema,
      required: [true, "Shipping address is required"],
    },
    subtotal: {
      type: Number,
      required: [true, "Order subtotal is required"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    shippingCharge: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      required: [true, "GST / Tax calculation is required"],
    },
    total: {
      type: Number,
      required: [true, "Order total payment amount is required"],
    },
    couponApplied: {
      type: String,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
      default: "Razorpay",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    estimatedDeliveryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
