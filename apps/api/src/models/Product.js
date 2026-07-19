const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category reference is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, "Discount price cannot be negative"],
    },
    weight: {
      type: String,
      required: [true, "Default packaging weight is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock level is required"],
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    sweetType: {
      type: String,
      required: [true, "Sweet type identifier is required (e.g. laddu, ariselu)"],
    },
    color: {
      type: String,
      default: "from-amber-50 to-orange-100",
    },
    textColor: {
      type: String,
      default: "text-amber-800",
    },
    ingredients: [
      {
        type: String,
      },
    ],
    nutritionalValue: {
      type: Map,
      of: String,
    },
    badge: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
