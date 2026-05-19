const express = require("express");

const {
  getDashboard,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, admin);
router.get("/dashboard", getDashboard);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/orders", getOrders);
router.patch("/orders/:id/status", updateOrderStatus);

module.exports = router;
