const Product = require("../models/Product");
const Review = require("../models/Review");
const Category = require("../models/Category");
const UploadsController = require("../controllers/uploadsController");

class ProductController {
  async getAllProduct(req, res) {
    const query = Product.apiFeatures(req.query);
    const result = await query.execApiFeatures();
    res.json(result);
  }
  async getProductbyId(req, res) {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
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
    let images = [];
    //save images path
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const imageUrl = await UploadsController.uploadCloudByCloudinary({
          file,
        });
        images.push(imageUrl);
      }
    }
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
    if (req.files && req.files.length > 0) {
      images = [];
      for (let file of req.files) {
        const imageUrl = await uploadToCloudinary(file);
        if (imageUrl) {
          images.push(imageUrl);
        }
      }
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
  async addReview(req, res) {
    const productId = req.params.id;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //upload images
    let images = [];
    //save images path
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const imageUrl = await UploadsController.uploadCloudByCloudinary({
          file,
        });
        images.push(imageUrl);
      }
    }

    const newReview = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment,
      images,
    });
    const allReviews = await Review.find({ product: productId });

    const avg =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    product.ratings = avg;
    product.numReviews = allReviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });
  }
  async getProductReviews(req, res) {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .populate("product", "name");
    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  }
  async getCategories(req, res) {
    const categories = await Category.find().populate("parentCategory");

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  }
}

module.exports = new ProductController();
