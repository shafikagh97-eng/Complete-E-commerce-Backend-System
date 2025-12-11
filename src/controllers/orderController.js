const Order = require("../models/Order");
const Cart = require("../models/Cart");
const sendMessage = require("../utils/sendEmail");

class OrderController {
  async createOrder(req, res) {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Missing order details" });
    }

    const itemsPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const taxPrice = Number((itemsPrice * 0.11).toFixed(2));
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = Number(
      (itemsPrice + taxPrice + shippingPrice).toFixed(2)
    );

    const order = await Order.create({
      user: req.user.id,
      items: cart.items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    await sendMessage({
      from: "e-commerceapp@example.com",
      to: req.user.email,
      subject: "Order Email",
      text: `
        <h2>Thank you for your order!</h2>
        <p>Your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total:</strong> $${order.totalPrice}</p>
      `,
    });
    await Cart.findOneAndDelete({ user: req.user.id });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  }
  async getUserOrders(req, res) {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price image");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  }
  async getOrderByid(req, res) {
    const order = await Order.findById(req.params.id)
      .populate("items.productId", "name price image")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  }
}

module.exports = new OrderController();
