const express = require("express");
const router = express.Router();
const { authorize, requireAuth } = require("../middlewares/authMiddleware");
const UserController = require("../controllers/userController");
const asyncHandler = require("../utils/asyncHandler");
const { updateUserValidation } = require("../validation/userValidation");
const validate = require("../middlewares/validationMiddleware");
router.get(
  "/profile",
  [requireAuth],
  asyncHandler(UserController.getUserProfile)
);
router.put(
  "/profile",
  [requireAuth, ...updateUserValidation, validate],
  asyncHandler(UserController.updateUserProfile)
);
router.put(
  "/address",
  [requireAuth],
  asyncHandler(UserController.updateShippingAdress)
);

module.exports = router;
