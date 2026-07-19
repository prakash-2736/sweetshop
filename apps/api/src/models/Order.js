const mongoose = require("mongoose");
const { OrderItemSchema } = require("./OrderItem");
const { AddressSchema } = require("./Address");

const TrackingTimelineSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

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
      index: true,
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
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
      default: "Razorpay",
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Return Requested",
        "Returned",
        "Return Rejected",
        "Refunded",
      ],
      default: "Pending",
      index: true,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
    },
    razorpaySignature: {
      type: String,
      trim: true,
    },
    invoicePath: {
      type: String,
      trim: true,
    },
    trackingDetails: {
      carrier: { type: String, default: "Shiprocket Simulation" },
      trackingNumber: { type: String },
      status: { type: String },
      timeline: [TrackingTimelineSchema],
    },
    returnDetails: {
      reason: { type: String },
      status: { type: String, enum: ["None", "Requested", "Approved", "Rejected"], default: "None" },
      requestedAt: { type: Date },
      processedAt: { type: Date },
    },
    refundDetails: {
      refundId: { type: String },
      amount: { type: Number },
      status: { type: String },
      reason: { type: String },
      processedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
