const Review = require("../models/Review");
const Product = require("../models/Product");
const UploadsController = require("../controllers/uploadsController");

class ReviewController {
  async update(req, res) {
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    //check user is the review owner
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this review",
      });
    }

    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.comment) review.comment = req.body.comment;

    //add new images or save the old one
    let newImages = req.cloudImages || [];
    if (newImages.length > 0) {
      review.images = newImages;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  }

  async delete(req, res) {
    const reviewId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    //check if review exist
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    //check user is the review owner
    if (review.user.toString() !== userId.toString() && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this review",
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);
    //update reviews values for the product
    const reviews = await Review.find({ product: productId });

    let avg = 0;
    if (reviews.length > 0) {
      avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    }

    await Product.findByIdAndUpdate(productId, {
      ratings: avg,
      numReviews: reviews.length,
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      review,
    });
  }
}
module.exports = new ReviewController();
