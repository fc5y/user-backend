const { validationMiddleware } = require("./common");
const { body, param, query } = require("express-validator");

// POST /api/v1/participations
const register = [
  body("contest_name")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .isLength({ min: 1, max: 255 }),
  validationMiddleware,
];

// GET /api/v1/participations/{username}
const getAllByUsername = [
  query("offset").isInt({ min: 0 }),
  query("limit").isInt({ min: 0 }),
  param("username")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("value must only contain allowed characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
  validationMiddleware,
];

// GET api/v1/participations/{contest_name}/cred
const getCredential = [
  param("contest_name")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("value must only contain allowed characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
  validationMiddleware,
];

module.exports = {
  register,
  getAllByUsername,
  getCredential,
};
