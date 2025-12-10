const mongoose = require("mongoose");
const apiFeaturesPlugin = require("../utils/apiFeatures");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0.0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    features: [{ type: String }],
    brand: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
productSchema.plugin(apiFeaturesPlugin, {
  searchFields: ["name", "description"],
});
module.exports = mongoose.model("Product", productSchema);
