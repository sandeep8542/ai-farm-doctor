const mongoose = require("mongoose");

const detectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    disease: {
      type: String,
      default: "",
    },
    symptoms: {
      type: String,
      default: "",
    },
    recommendations: {
      type: [String],
      default: [],
    },
    confidence: {
      type: Number,
      default: 0,
    },
    severity: {
      type: String,
      default: "Low",
    },
    cropType: {
      type: String,
      default: "Unknown",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Detection", detectionSchema);