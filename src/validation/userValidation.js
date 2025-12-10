const { body } = require("express-validator");
updateUserValidation = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email").optional().isEmail().withMessage("Please enter a valid email"),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("phone").optional().isNumeric().withMessage("Phone must be a number"),

  body("avatar").optional().isString().withMessage("Avatar must be a string"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
];

module.exports = { updateUserValidation };
