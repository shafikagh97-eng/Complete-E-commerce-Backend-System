const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloud = require("../middlewares/uploadMiddleware");
const ReviewController = require("../controllers/reviewController");
const { requireAuth } = require("../middlewares/authMiddleware");
router.put(
  "/:id",
  [requireAuth, multer().array("images", 5), uploadCloud],
  ReviewController.update
);

router.delete("/:id", [requireAuth], ReviewController.delete);

module.exports = router;
