const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Home", "Office", "Other"],
      default: "Home",
    },
    street: {
      type: String,
      required: [true, "Street address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    zipCode: {
      type: String,
      required: [true, "ZIP / PIN code is required"],
      match: [/^\d{6}$/, "ZIP code must be exactly 6 digits"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = {
  AddressSchema,
  Address: mongoose.model("Address", AddressSchema),
};
