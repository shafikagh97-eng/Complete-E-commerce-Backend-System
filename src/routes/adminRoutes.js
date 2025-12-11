const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authorize, requireAuth } = require("../middlewares/authMiddleware");
const uploadCloud = require("../middlewares/uploadMiddleware");
const validate = require("../middlewares/validationMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const AdminController = require("../controllers/adminController");
const {
  updateOrderStatusValidation,
} = require("../validation/orderValidation");
const {
  createProductValidation,
  updateProductValidation,
} = require("../validation/productValidation");
//category
router.post(
  "/category",
  [requireAuth, authorize("admin"), multer().array("images", 10), uploadCloud],
  asyncHandler(AdminController.addCategory)
);
//order
router.get(
  "/orders/all",
  [requireAuth, authorize("admin")],
  asyncHandler(AdminController.getAllOrders)
);
router.put(
  "/orders/:id/status",
  [requireAuth, authorize("admin"), ...updateOrderStatusValidation, validate],
  asyncHandler(AdminController.updateStatus)
);

//product
router.post(
  "/products",
  [
    requireAuth,
    authorize("admin"),
    multer().array("images", 10),
    uploadCloud,
    ...createProductValidation,
    validate,
  ],
  asyncHandler(AdminController.addProduct)
);

router.put(
  "/products/:id",
  [
    requireAuth,
    authorize("admin"),
    multer().array("images", 10),
    uploadCloud,
    ...updateProductValidation,
    validate,
  ],
  asyncHandler(AdminController.updateProduct)
);
router.delete(
  "/products/:id",
  [requireAuth, authorize("admin")],
  asyncHandler(AdminController.deleteProduct)
);
//user
router.get(
  "/users/all",
  [requireAuth, authorize("admin")],
  AdminController.getAllUsers
);
router.put(
  "/users/:id/role",
  [requireAuth, authorize("admin")],
  AdminController.updateUserRole
);
module.exports = router;
