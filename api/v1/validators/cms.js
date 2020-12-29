const { validationMiddleware } = require("./common");
const { body } = require("express-validator");

// POST /api/v1/cms/syncAll
const syncAll = [
  body("contest_name")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("value must only contain allowed characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
  validationMiddleware,
];

module.exports = {
  syncAll,
};
