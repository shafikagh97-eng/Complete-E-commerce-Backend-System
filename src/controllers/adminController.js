const Category = require("../models/Category");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const UploadsController = require("../controllers/uploadsController");

class AdminController {
  async addCategory(req, res) {
    const { name, description, parentCategory } = req.body;
    const images = req.cloudImages || [];
    const category = await Category.create({
      name,
      description,
      images,
      parentCategory: parentCategory || null,
    });

    res.status(201).json({ success: true, category });
  }
  async getAllOrders(req, res) {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("items.productId", "name price image");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  }
  async updateStatus(req, res) {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const allowedStatus = [
      "pending",
      "processing",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatus.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    if (status === "paid") {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  }
  async addProduct(req, res) {
    const {
      name,
      description,
      price,
      category,
      stock,
      ratings,
      numReviews,
      features,
      brand,
    } = req.body;
    //upload images
    const images = req.cloudImages || [];
    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
      stock,
      ratings,
      numReviews,
      features,
      brand,
      images,
    });

    return res.status(201).json({
      success: true,
      data: product,
    });
  }

  async updateProduct(req, res) {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const {
      name,
      description,
      price,
      category,
      stock,
      ratings,
      numReviews,
      features,
      brand,
    } = req.body;
    let images = product.images;
    //update images or keep old one
    if (req.cloudImages.length > 0) {
      images = req.cloudImages;
    }
    if (name !== undefined) {
      product.name = name;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (price !== undefined) {
      product.price = price;
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (stock !== undefined) {
      product.stock = stock;
    }

    if (ratings !== undefined) {
      product.ratings = ratings;
    }

    if (numReviews !== undefined) {
      product.numReviews = numReviews;
    }

    if (features !== undefined) {
      product.features = features;
    }

    if (brand !== undefined) {
      product.brand = brand;
    }

    product.images = images;
    await product.save();

    return res.status(200).json({
      success: true,
      data: product,
    });
  }
  async deleteProduct(req, res) {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
  async getAllUsers(req, res) {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  }
  async updateUserRole(req, res) {
    const { role } = req.body;
    const allowedRoles = ["user", "admin"];

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`,
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  }
}
module.exports = new AdminController();
