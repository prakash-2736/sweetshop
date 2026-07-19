const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, "Action description is required"],
      index: true,
    },
    targetType: {
      type: String,
      enum: ["PRODUCT", "CATEGORY", "INVENTORY", "MEDIA"],
      required: [true, "Target resource type is required"],
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Target resource ID is required"],
      index: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User performing action is required"],
      index: true,
    },
    previousState: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newState: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Audit logs are immutable, only creation time matters
  }
);

module.exports = mongoose.model("AuditLog", AuditLogSchema);
