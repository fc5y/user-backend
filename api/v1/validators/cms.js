const { validationMiddleware } = require("./common");
const { body } = require("express-validator");

// POST /api/v1/cms/syncAll
const syncAll = [
  body("contest_name")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .isLength({ min: 1, max: 255 }),
  validationMiddleware,
];

module.exports = {
  syncAll,
};
