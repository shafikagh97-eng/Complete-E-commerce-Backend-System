const { body, param } = require("express-validator");

const passwordValidation = [
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "The password must contain at least 8 characters, including a lowercase letter, an uppercase letter, a number, and a symbol."
    ),
];

registerValidation = [
  body("name", "Name is required").not().isEmpty(),
  body("email", "Please include a valid email").isEmail(),
];

loginValidation = [
  body("email", "Please include a valid email").isEmail(),
  body("password", "Password is required").exists(),
];
module.exports = { passwordValidation, registerValidation, loginValidation };
