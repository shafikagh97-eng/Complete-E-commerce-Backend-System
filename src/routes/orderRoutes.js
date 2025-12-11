const express = require("express");
const router = express.Router();
const { authorize, requireAuth } = require("../middlewares/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const OrderController = require("../controllers/orderController");
const orderController = require("../controllers/orderController");
const {
  createOrderValidation,
  updateOrderStatusValidation,
} = require("../validation/orderValidation");
const validate = require("../middlewares/validationMiddleware");
router.post(
  "/",
  [requireAuth, ...createOrderValidation, validate],
  asyncHandler(OrderController.createOrder)
);
router.get("/", [requireAuth], asyncHandler(orderController.getUserOrders));
router.get("/:id", [requireAuth], asyncHandler(orderController.getOrderByid));

module.exports = router;
