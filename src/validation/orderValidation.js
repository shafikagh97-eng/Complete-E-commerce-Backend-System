const { body } = require("express-validator");

createOrderValidation = [
  body("shippingAddress", "Shipping Address ID is required").isMongoId(),

  body("paymentMethod", "Payment method is required").notEmpty(),
];
updateOrderStatusValidation = [
  body("status", "Status is required")
    .notEmpty()
    .isIn([
      "pending",
      "processing",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .withMessage(
      "Status must be one of: pending, processing, paid, shipped, delivered, cancelled"
    ),
];
module.exports = { createOrderValidation, updateOrderStatusValidation };
