const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authorize, requireAuth } = require("../middlewares/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const CategoryController = require("../controllers/categoryController");
router.post(
  "/",
  [requireAuth, authorize("admin"), multer().array("images", 10)],
  asyncHandler(CategoryController.add)
);
module.exports = router;
