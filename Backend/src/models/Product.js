const mongoose = require("mongoose");

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
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    brand: {
      type: String,
      default: "Apna Bazaar",
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    colors: [
      {
        name: {
          type: String,
          required: true,
        },
        hex: {
          type: String,
          required: true,
        },
        gallery: {
          type: [String],
          default: [],
        },
      },
    ],
    sizes: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    highlights: {
      type: [String],
      default: [],
    },
    deliveryDays: {
      type: Number,
      default: 3,
      min: 1,
    },
    returnPolicy: {
      type: String,
      default: "7-day replacement available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
