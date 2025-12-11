const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authorize, requireAuth } = require("../middlewares/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const ProductController = require("../controllers/productController");
const productController = require("../controllers/productController");
const {
  createProductValidation,
  updateProductValidation,
} = require("../validation/productValidation");
const validate = require("../middlewares/validationMiddleware");
router.get("/", [requireAuth], asyncHandler(ProductController.getAllProduct));
router.get(
  "/categories",
  [requireAuth],
  asyncHandler(productController.getCategories)
);

router.get(
  "/:id",
  [requireAuth],
  asyncHandler(ProductController.getProductbyId)
);
router.post(
  "/:id/reviews",
  [requireAuth, multer().array("images", 5)],
  asyncHandler(productController.addReview)
);

router.post(
  "/:id/reviews",
  [requireAuth, multer().array("images", 5)],
  asyncHandler(productController.addReview)
);
router.get(
  "/:id/reviews",
  [requireAuth],
  asyncHandler(productController.getProductReviews)
);

module.exports = router;
