const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error("Order items are required");
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      res.status(400);
      throw new Error("Complete shipping address is required");
    }

    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const normalizedItems = items.map((item) => {
      const product = productMap.get(String(item.product));

      if (!product) {
        res.status(404);
        throw new Error("One or more products were not found");
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        res.status(400);
        throw new Error("Each item quantity must be at least 1");
      }

      if (quantity > product.stock) {
        res.status(400);
        throw new Error(`${product.name} does not have enough stock`);
      }

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      };
    });

    const totalAmount = normalizedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      shippingAddress,
      totalAmount,
    });

    await Promise.all(
      normalizedItems.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        })
      )
    );

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

const cancelMyOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.status !== "pending") {
      res.status(400);
      throw new Error("Only pending orders can be cancelled");
    }

    order.status = "cancelled";
    await order.save();

    await Promise.all(
      order.items.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        })
      )
    );

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  cancelMyOrder,
  createOrder,
  getMyOrders,
};
