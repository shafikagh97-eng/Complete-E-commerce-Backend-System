const Cart = require("../models/Cart");
const Product = require("../models/Product");
class CartController {
  async addItem(req, res) {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "productId and quantity are required",
      });
    }
    //product founded
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    //if cart exist
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    //if product exist
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = existingItem.quantity * product.price;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price * quantity,
      });
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  }
  async getCart(req, res) {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });
  }
  async removeItem(req, res) {
    const userId = req.user.id;
    const itemId = req.params.itemId;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find((i) => i._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items = cart.items.filter((i) => i._id.toString() !== itemId);

    cart.totalPrice = cart.items.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  }
  async updateQuantity(req, res) {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    //find item
    const item = cart.items.find((i) => i._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    item.quantity = quantity;

    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cart,
    });
  }
  async clearCart(req, res) {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  }
}
module.exports = new CartController();
