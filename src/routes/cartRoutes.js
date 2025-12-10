const express = require("express");
const CartController = require("../controllers/cartController");
const router = express.Router();
const { authorize, requireAuth } = require("../middlewares/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const cartController = require("../controllers/cartController");
router.post("/", [requireAuth], asyncHandler(cartController.addItem));
router.get("/", [requireAuth], asyncHandler(cartController.getCart));
router.put(
  "/:itemId",
  [requireAuth],
  asyncHandler(cartController.updateQuantity)
);
router.delete(
  "/:itemId",
  [requireAuth],
  asyncHandler(cartController.removeItem)
);
router.delete("/", [requireAuth], asyncHandler(cartController.clearCart));
module.exports = router;
