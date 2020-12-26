const { validationMiddleware } = require("./common");
const { body, oneOf } = require("express-validator");

const sendOtp = [
  body("email")
    .isEmail()
    .withMessage("value must be a valid email address")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
];

const signup = [
  body("email")
    .isEmail()
    .withMessage("value must be a valid email address")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
  body("username")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("value must only contain allowed characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
  body("otp")
    .matches(/^[0-9]{6}$/)
    .withMessage("value must only contain exactly 6 digits"),
  body("password")
    .matches(/^[\x20-\x7E]+$/)
    .withMessage("value must only contain allowed characters")
    .isLength({ min: 8, max: 255 })
    .withMessage("password length must be in range 8 to 255"),
  body("full_name")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
  body("school_name")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
];

const login = [
  oneOf([
    body("email_or_username")
      .matches(/^[a-zA-Z0-9_.-]+$/)
      .withMessage("value must only contain allowed characters")
      .isLength({ min: 1, max: 255 })
      .withMessage("value's length must be in range 1 to 255"),
    body("email_or_username")
      .isEmail()
      .withMessage("value must be a valid email address")
      .isLength({ min: 1, max: 255 })
      .withMessage("value's length must be in range 1 to 255"),
  ]),
  validationMiddleware,
];

module.exports = {
  sendOtp,
  signup,
  login,
};
