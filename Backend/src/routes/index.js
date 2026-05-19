const express = require("express");

const { getHealthStatus } = require("../controllers/healthController");
const adminRoutes = require("./adminRoutes");
const authRoutes = require("./authRoutes");
const orderRoutes = require("./orderRoutes");
const productRoutes = require("./productRoutes");

const router = express.Router();

router.get("/health", getHealthStatus);
router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
