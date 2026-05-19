const baseProducts = [
  {
    name: "Wireless Headphones",
    description: "Comfortable over-ear headphones with deep bass and long battery life.",
    price: 2499,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Electronics",
    stock: 15,
  },
  {
    name: "Smart Watch",
    description: "Fitness tracking smart watch with heart-rate monitoring and notifications.",
    price: 3499,
    image: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Electronics",
    stock: 12,
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes designed for everyday training.",
    price: 1999,
    image: "https://images.pexels.com/photos/27516982/pexels-photo-27516982.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fashion",
    stock: 20,
  },
  {
    name: "Laptop Backpack",
    description: "Water-resistant backpack with padded laptop sleeve and organizer pockets.",
    price: 1499,
    image: "https://images.pexels.com/photos/1546003/pexels-photo-1546003.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Accessories",
    stock: 18,
  },
  {
    name: "Coffee Maker",
    description: "Compact coffee maker for quick brews at home or in the office.",
    price: 2799,
    image: "/assets/products/coffee-maker.png",
    category: "Home",
    stock: 10,
  },
  {
    name: "Desk Lamp",
    description: "Adjustable LED desk lamp with touch controls and brightness levels.",
    price: 899,
    image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Home",
    stock: 25,
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable speaker with crisp sound, compact build, and all-day battery.",
    price: 1799,
    image: "/assets/products/bluetooth-speaker.png",
    category: "Electronics",
    stock: 16,
  },
  {
    name: "Cotton Kurta",
    description: "Breathable everyday kurta with a clean fit and soft cotton finish.",
    price: 1299,
    image: "https://images.pexels.com/photos/29133977/pexels-photo-29133977.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fashion",
    stock: 22,
  },
  {
    name: "Yoga Mat",
    description: "Non-slip cushioned yoga mat for workouts, stretching, and meditation.",
    price: 999,
    image: "https://images.pexels.com/photos/8032959/pexels-photo-8032959.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fitness",
    stock: 28,
  },
  {
    name: "Denim Jacket",
    description: "Classic layered denim jacket with a relaxed everyday fit.",
    price: 1899,
    image: "https://images.pexels.com/photos/7679444/pexels-photo-7679444.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fashion",
    stock: 17,
  },
  {
    name: "Summer Dress",
    description: "Lightweight dress with a polished silhouette for day-to-evening wear.",
    price: 2199,
    image: "https://images.pexels.com/photos/19733576/pexels-photo-19733576.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fashion",
    stock: 14,
  },
  {
    name: "Casual Shirt",
    description: "Soft casual shirt with an easy fit for daily styling.",
    price: 1199,
    image: "/assets/products/casual-shirt.png",
    category: "Fashion",
    stock: 24,
  },
  {
    name: "Vinyl Dumbbells",
    description: "Compact dumbbell pair for home strength training and toning.",
    price: 1399,
    image: "https://images.pexels.com/photos/16567048/pexels-photo-16567048.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fitness",
    stock: 21,
  },
  {
    name: "Ab Roller Kit",
    description: "Core training kit with ab roller and dumbbells for home workouts.",
    price: 1599,
    image: "https://images.pexels.com/photos/8033019/pexels-photo-8033019.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fitness",
    stock: 18,
  },
  {
    name: "Workout Essentials Set",
    description: "Dumbbells, rope, and mat basics for a complete home workout setup.",
    price: 2499,
    image: "https://images.pexels.com/photos/8032746/pexels-photo-8032746.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fitness",
    stock: 16,
  },
  {
    name: "Ceramic Dinner Set",
    description: "Minimal ceramic tableware set for everyday meals and hosting.",
    price: 2199,
    image: "https://images.pexels.com/photos/6270541/pexels-photo-6270541.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Home",
    stock: 14,
  },
  {
    name: "Steel Water Bottle",
    description: "Insulated bottle that keeps drinks cool for long commutes and travel.",
    price: 699,
    image: "https://images.pexels.com/photos/3766180/pexels-photo-3766180.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Accessories",
    stock: 30,
  },
  {
    name: "Skin Care Kit",
    description: "Daily care essentials with cleanser, moisturizer, and soothing serum.",
    price: 1599,
    image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Beauty",
    stock: 19,
  },
  {
    name: "Study Chair",
    description: "Supportive chair with padded seating for long work and study sessions.",
    price: 4299,
    image: "https://images.pexels.com/photos/2180883/pexels-photo-2180883.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Furniture",
    stock: 9,
  },
  {
    name: "Travel Trolley",
    description: "Cabin-size trolley bag with smooth wheels and organized compartments.",
    price: 3299,
    image: "/assets/products/travel-trolley.png",
    category: "Travel",
    stock: 11,
  },
  {
    name: "Wireless Earbuds",
    description: "Compact true wireless earbuds with noise cancellation and charging case.",
    price: 1999,
    image: "https://images.pexels.com/photos/373945/pexels-photo-373945.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Electronics",
    stock: 30,
  },
  {
    name: "Phone Case (Silicone)",
    description: "Soft-touch silicone phone case with raised edges for camera protection.",
    price: 499,
    image: "/assets/products/phone-case-silicone.png",
    category: "Accessories",
    stock: 48,
  },
  {
    name: "Formal Shirt",
    description: "Slim-fit formal shirt made from breathable cotton — perfect for office wear.",
    price: 1499,
    image: "/assets/products/formal-shirt.png",
    category: "Fashion",
    stock: 26,
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Over-ear headphones with active noise cancellation and long battery life.",
    price: 6999,
    image: "/assets/products/noise-cancelling-headphones.png",
    category: "Electronics",
    stock: 8,
  },
  {
    name: "Throw Cushion (Set of 2)",
    description: "Decorative cushions to add a pop of colour to your living room.",
    price: 799,
    image: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Home",
    stock: 40,
  },
  {
    name: "Fitness Tracker Band",
    description: "Lightweight fitness band with step tracking, sleep monitoring and notifications.",
    price: 1299,
    image: "https://images.pexels.com/photos/277406/pexels-photo-277406.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Fitness",
    stock: 22,
  },
  {
    name: "Stainless Steel Lunch Box",
    description: "Leakproof lunch box with multiple compartments for balanced meals.",
    price: 599,
    image: "/assets/products/stainless-steel-lunch-box.png",
    category: "Home",
    stock: 35,
  },
  {
    name: "Sunglasses",
    description: "UV-protective polarized sunglasses with a lightweight frame.",
    price: 899,
    image: "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Accessories",
    stock: 44,
  },
  {
    name: "Kids T-shirt",
    description: "Soft cotton t-shirt for kids with playful prints.",
    price: 499,
    image: "/assets/products/kids-tshirt.png",
    category: "Fashion",
    stock: 50,
  },
];

const categoryDefaults = {
  Electronics: {
    brand: "Apna Tech",
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: [],
    deliveryDays: 2,
    returnPolicy: "7-day replacement for manufacturing defects",
    specifications: {
      warranty: "1 year",
      connectivity: "Wireless",
      power: "Rechargeable battery",
    },
    highlights: [
      "Designed for everyday use with reliable performance.",
      "Easy setup and simple controls for quick use.",
      "Packed securely and quality checked before dispatch.",
    ],
  },
  Fashion: {
    brand: "Apna Wear",
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: ["S", "M", "L", "XL"],
    deliveryDays: 3,
    returnPolicy: "10-day easy return and size exchange",
    specifications: {
      material: "Cotton blend",
      fit: "Regular fit",
      care: "Machine wash",
    },
    highlights: [
      "Comfortable fabric made for all-day wear.",
      "Easy to style for casual and semi-formal looks.",
      "Size exchange available within the return window.",
    ],
  },
  Accessories: {
    brand: "Apna Essentials",
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: [],
    deliveryDays: 3,
    returnPolicy: "7-day return available",
    specifications: {
      material: "Durable mixed materials",
      usage: "Everyday use",
      care: "Wipe clean",
    },
    highlights: [
      "Built for daily convenience and repeated use.",
      "Compact, practical, and easy to carry.",
      "Checked for finish and durability before shipping.",
    ],
  },
  Home: {
    brand: "Apna Home",
    colors: [{ name: "White", hex: "#f8fafc" }],
    sizes: [],
    deliveryDays: 4,
    returnPolicy: "7-day replacement available",
    specifications: {
      material: "Home-grade materials",
      usage: "Indoor",
      care: "Easy maintenance",
    },
    highlights: [
      "Made for practical everyday home use.",
      "Easy to clean and maintain.",
      "Designed to blend into modern spaces.",
    ],
  },
  Fitness: {
    brand: "Apna Fit",
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: [],
    deliveryDays: 3,
    returnPolicy: "7-day replacement available",
    specifications: {
      usage: "Home workout",
      material: "Training-grade materials",
      care: "Wipe after use",
    },
    highlights: [
      "Suitable for regular home workouts.",
      "Compact design for easy storage.",
      "Built for grip, comfort, and daily training.",
    ],
  },
  Beauty: {
    brand: "Apna Beauty",
    colors: [],
    sizes: [],
    deliveryDays: 2,
    returnPolicy: "Non-returnable after opening",
    specifications: {
      skinType: "Suitable for most skin types",
      usage: "Daily care",
      shelfLife: "24 months",
    },
    highlights: [
      "Curated for a simple daily-care routine.",
      "Sealed packaging for hygiene and freshness.",
      "Read usage directions before application.",
    ],
  },
  Furniture: {
    brand: "Apna Living",
    colors: [{ name: "Walnut", hex: "#8b5e3c" }],
    sizes: [],
    deliveryDays: 5,
    returnPolicy: "10-day replacement for damaged delivery",
    specifications: {
      material: "Engineered wood and steel",
      assembly: "Basic assembly required",
      usage: "Indoor",
    },
    highlights: [
      "Built for daily comfort and support.",
      "Stable frame with practical proportions.",
      "Packed carefully for safer delivery.",
    ],
  },
  Travel: {
    brand: "Apna Travel",
    colors: [{ name: "Black", hex: "#111827" }],
    sizes: ["Cabin"],
    deliveryDays: 4,
    returnPolicy: "7-day return available",
    specifications: {
      material: "Polycarbonate shell",
      wheels: "360-degree spinner wheels",
      usage: "Travel",
    },
    highlights: [
      "Organized compartments for easier packing.",
      "Smooth rolling design for travel days.",
      "Sized for practical everyday trips.",
    ],
  },
};

const productOverrides = {
  "Wireless Headphones": {
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Silver", hex: "#cbd5e1" },
    ],
    specifications: { formFactor: "Over-ear", batteryLife: "Up to 30 hours" },
  },
  "Smart Watch": {
    colors: [
      { name: "Silver", hex: "#d1d5db" },
      { name: "Black", hex: "#111827" },
      { name: "Rose Gold", hex: "#d9a3a6" },
    ],
    specifications: { display: "Touch display", sensors: "Heart-rate monitor" },
  },
  "Running Shoes": {
    colors: [
      { name: "White", hex: "#f8fafc" },
      { name: "Black", hex: "#111827" },
      { name: "Navy", hex: "#1e3a8a" },
    ],
    specifications: { sole: "Cushioned rubber", closure: "Lace-up" },
  },
  "Laptop Backpack": {
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Olive", hex: "#556b2f" },
      { name: "Tan", hex: "#c49a6c" },
    ],
  },
  "Coffee Maker": {
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Steel", hex: "#94a3b8" },
    ],
  },
  "Desk Lamp": {
    colors: [
      { name: "White", hex: "#f8fafc" },
      { name: "Black", hex: "#111827" },
    ],
  },
  "Bluetooth Speaker": {
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Blue", hex: "#2563eb" },
      { name: "Red", hex: "#dc2626" },
    ],
  },
  "Cotton Kurta": {
    colors: [
      { name: "Rust", hex: "#9a3412" },
      { name: "Indigo", hex: "#3730a3" },
      { name: "Olive", hex: "#556b2f" },
    ],
    specifications: { material: "Soft cotton", neckline: "Mandarin collar" },
  },
  "Yoga Mat": {
    colors: [
      { name: "Teal", hex: "#0f766e" },
      { name: "Purple", hex: "#7c3aed" },
      { name: "Black", hex: "#111827" },
    ],
    specifications: { thickness: "6 mm", grip: "Non-slip texture" },
  },
  "Denim Jacket": {
    colors: [
      { name: "Indigo", hex: "#1d4ed8" },
      { name: "Washed Blue", hex: "#60a5fa" },
    ],
  },
  "Summer Dress": {
    colors: [
      { name: "Floral Pink", hex: "#f472b6" },
      { name: "Ivory", hex: "#fff7ed" },
      { name: "Sage", hex: "#86a873" },
    ],
  },
  "Casual Shirt": {
    colors: [
      { name: "Sky Blue", hex: "#38bdf8" },
      { name: "White", hex: "#f8fafc" },
      { name: "Charcoal", hex: "#374151" },
    ],
  },
  "Vinyl Dumbbells": {
    colors: [
      { name: "Pink", hex: "#ec4899" },
      { name: "Blue", hex: "#2563eb" },
      { name: "Grey", hex: "#6b7280" },
    ],
    specifications: { weight: "Pair set", coating: "Vinyl finish" },
  },
  "Ab Roller Kit": {
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Orange", hex: "#f97316" },
    ],
  },
  "Workout Essentials Set": {
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Grey", hex: "#6b7280" },
    ],
  },
  "Ceramic Dinner Set": {
    colors: [
      { name: "Ivory", hex: "#fffaf0" },
      { name: "Stone", hex: "#d6d3d1" },
    ],
  },
  "Steel Water Bottle": {
    colors: [
      { name: "Steel", hex: "#94a3b8" },
      { name: "Black", hex: "#111827" },
      { name: "Blue", hex: "#2563eb" },
    ],
  },
  "Study Chair": {
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Grey", hex: "#6b7280" },
    ],
  },
  "Travel Trolley": {
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Navy", hex: "#1e3a8a" },
      { name: "Wine", hex: "#7f1d1d" },
    ],
    sizes: ["Cabin", "Medium", "Large"],
  },
  "Wireless Earbuds": {
    colors: [
      { name: "White", hex: "#f8fafc" },
      { name: "Black", hex: "#111827" },
    ],
  },
  "Phone Case (Silicone)": {
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Lilac", hex: "#c4b5fd" },
      { name: "Mint", hex: "#86efac" },
    ],
  },
  "Formal Shirt": {
    colors: [
      { name: "White", hex: "#f8fafc" },
      { name: "Sky Blue", hex: "#38bdf8" },
      { name: "Black", hex: "#111827" },
    ],
  },
  "Throw Cushion (Set of 2)": {
    colors: [
      { name: "Mustard", hex: "#d97706" },
      { name: "Terracotta", hex: "#c2410c" },
      { name: "Sage", hex: "#86a873" },
    ],
  },
  "Fitness Tracker Band": {
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Blue", hex: "#2563eb" },
      { name: "Coral", hex: "#fb7185" },
    ],
  },
  "Stainless Steel Lunch Box": {
    colors: [
      { name: "Steel", hex: "#94a3b8" },
      { name: "Mint", hex: "#86efac" },
    ],
  },
  Sunglasses: {
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Tortoise", hex: "#8b5e3c" },
    ],
  },
  "Kids T-shirt": {
    colors: [
      { name: "Yellow", hex: "#facc15" },
      { name: "Blue", hex: "#3b82f6" },
      { name: "Pink", hex: "#f472b6" },
    ],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
  },
};

const products = baseProducts.map((product) => {
  const defaults = categoryDefaults[product.category] || categoryDefaults.Accessories;
  const override = productOverrides[product.name] || {};
  const colors = (override.colors || defaults.colors).map((color, index) => ({
    ...color,
    gallery: color.gallery || (index === 0 ? [product.image] : []),
  }));

  return {
    ...product,
    brand: defaults.brand,
    gallery: [product.image],
    colors,
    sizes: override.sizes || defaults.sizes,
    deliveryDays: defaults.deliveryDays,
    returnPolicy: defaults.returnPolicy,
    specifications: {
      ...defaults.specifications,
      ...override.specifications,
    },
    highlights: defaults.highlights,
  };
});

module.exports = products;
