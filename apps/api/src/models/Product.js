const mongoose = require("mongoose");

const ProductImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "Image URL is required"],
    trim: true,
  },
  publicId: {
    type: String,
    required: [true, "Cloudinary public ID is required"],
    trim: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
});

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: true,
      trim: true,
      index: true,
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
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
      index: true,
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
      index: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    status: {
      type: String,
      enum: ["Draft", "Pending Review", "Published", "Archived", "Out Of Stock"],
      default: "Draft",
      index: true,
    },
    images: [ProductImageSchema],
    rating: {
      type: Number,
      default: 4.5,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
      index: true,
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
        trim: true,
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
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Text indexes for Search implementation (Name, Description, Ingredients, SweetType)
ProductSchema.index(
  {
    name: "text",
    description: "text",
    sweetType: "text",
    ingredients: "text",
  },
  {
    weights: {
      name: 10,
      sweetType: 5,
      description: 3,
      ingredients: 1,
    },
    name: "ProductTextIndex",
  }
);

module.exports = mongoose.model("Product", ProductSchema);
