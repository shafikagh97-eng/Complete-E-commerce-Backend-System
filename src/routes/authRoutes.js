const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middlewares/validationMiddleware");
const {
  passwordValidation,
  registerValidation,
  loginValidation,
} = require("../validation/authValidation");
const asyncHandler = require("../utils/asyncHandler");
const { loginLimiter } = require("../middlewares/rateLimitMiddleware");
const { authorize, requireAuth } = require("../middlewares/authMiddleware");
const verifyTokenMiddleware = require("../middlewares/tokenMiddleware");

const router = express.Router();
router.post(
  "/sign",
  [...registerValidation, ...passwordValidation, validate],
  asyncHandler(authController.register)
);
router.post(
  "/login",
  [...loginValidation, ...passwordValidation, validate, loginLimiter],
  asyncHandler(authController.login)
);
router.post("/refresh-token", asyncHandler(authController.refreshToken));
router.post("/logout", [requireAuth], asyncHandler(authController.logout));
router.post(
  "/verify-email/:token",
  [verifyTokenMiddleware("verifyEmail")],
  asyncHandler(authController.verifyEmail)
);
router.post(
  "/forgot-password",
  [requireAuth, authorize("user")],
  asyncHandler(authController.forgotPassword)
);
router.post(
  "/reset-password/:token",
  [requireAuth, authorize("user"), verifyTokenMiddleware("resetPassword")],
  asyncHandler(authController.resetPassword)
);
router.put(
  "/update-password",
  [requireAuth, authorize("user"), ...passwordValidation],
  asyncHandler(authController.updatePassword)
);
module.exports = router;
