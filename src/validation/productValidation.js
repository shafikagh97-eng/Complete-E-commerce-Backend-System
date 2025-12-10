// src/validation/productValidation.js
const { body } = require("express-validator");

createProductValidation = [
  body("name", "Name is required").notEmpty().trim(),
  body("description", "Description is required").notEmpty(),
  body("price", "Price is required and must be a number >= 0")
    .notEmpty()
    .isFloat({ min: 0 }),
  body("category", "Category ID is required").notEmpty().isMongoId(),
  body("stock", "Stock is required and must be a number >= 0")
    .notEmpty()
    .isInt({ min: 0 }),

  body("images").optional().isArray(),
  body("images.*").optional().isString().withMessage("Image must be a string"),
  body("features").optional().isArray(),
  body("features.*")
    .optional()
    .isString()
    .withMessage("Feature must be a string"),
  body("brand").optional().isString(),
];

updateProductValidation = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number >= 0"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid ID"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a number >= 0"),
  body("ratings")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Ratings must be a number >= 0"),

  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*")
    .optional()
    .isString()
    .withMessage("Each image must be a string URL"),

  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),
  body("features.*")
    .optional()
    .isString()
    .withMessage("Each feature must be a string"),

  body("brand").optional().isString().withMessage("Brand must be a string"),
];

module.exports = { createProductValidation, updateProductValidation };
