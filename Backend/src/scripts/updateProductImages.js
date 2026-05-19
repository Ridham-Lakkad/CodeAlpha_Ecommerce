require("dotenv").config();

const connectDB = require("../config/db");
const Product = require("../models/Product");

const imageUpdates = {
  "Coffee Maker": "/assets/products/coffee-maker.png",
  "Casual Shirt": "/assets/products/casual-shirt.png",
  "Travel Trolley": "/assets/products/travel-trolley.png",
  "Phone Case (Silicone)": "/assets/products/phone-case-silicone.png",
};

const updateProductImages = async () => {
  try {
    await connectDB();

    const results = await Promise.all(
      Object.entries(imageUpdates).map(async ([name, image]) => {
        const product = await Product.findOne({ name });

        if (!product) {
          return { name, status: "missing" };
        }

        product.image = image;
        product.gallery = [image];
        product.colors = (product.colors || []).map((color, index) => ({
          ...(color.toObject?.() || color),
          gallery: index === 0 ? [image] : [],
        }));

        await product.save();
        return { name, status: "updated" };
      })
    );

    results.forEach(({ name, status }) => {
      console.log(`${name}: ${status}`);
    });
    process.exit(0);
  } catch (error) {
    console.error(`Image update failed: ${error.message}`);
    process.exit(1);
  }
};

updateProductImages();
