const { validationMiddleware } = require("./common");
const { body, param, query } = require("express-validator");

// POST /api/v1/contests
const createContest = [
  body("contest_name")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .isLength({ min: 1, max: 255 }),
  body("contest_title").isLength({ min: 1, max: 255 }),
  body("start_time").isInt({
    min: 1448841600, // 30/11/2015 00:00:00 GMT
    max: 2079993600, // 30/11/2035 00:00:00 GMT
  }),
  body("duration").optional().isInt({ min: 0 }),
  body("can_enter").isIn(["true", "false"]),
  validationMiddleware,
];

// POST /api/v1/contests/{contest_name}/delete
const deleteContest = [
  param("contest_name")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("value must only contain allowed characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
  validationMiddleware,
];

// POST /api/v1/contests/{contest_name}
const updateContest = [
  param("contest_name")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("value must only contain allowed characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
  body("contest_name")
    .optional()
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("value must only contain allowed characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
  body("contest_title")
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
  body("start_time")
    .optional()
    .isInt({
      min: 1448841600, // 30/11/2015 00:00:00 GMT
      max: 2079993600, // 30/11/2035 00:00:00 GMT
    })
    .withMessage("value must be in range 1448841600 to 2079993600"),
  body("duration")
    .optional()
    .isInt({ min: 0 })
    .withMessage("value must be a non-negative number"),
  body("can_enter")
    .optional()
    .isIn(["true", "false"])
    .withMessage("value must be either true or false"),
  body("materials.all_materials_url")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("value must be a valid URL or an empty string"),
  body("materials.statements_url")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("value must be a valid URL or an empty string"),
  body("materials.test_data_url")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("value must be a valid URL or an empty string"),
  body("materials.ranking_url")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("value must be a valid URL or an empty string"),
  body("materials.editorial_url")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("value must be a valid URL or an empty string"),
  body("materials.solution_url")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("value must be a valid URL or an empty string"),
  validationMiddleware,
];

// GET /api/v1/contests
const getAllContests = [
  query("offset").isInt({ min: 0 }),
  query("limit").isInt({ min: 0 }),
  validationMiddleware,
];

// GET /api/v1/contests/{contest_name}
const getContest = [
  param("contest_name")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .isLength({ min: 1, max: 255 }),
  validationMiddleware,
];

module.exports = {
  createContest,
  deleteContest,
  updateContest,
  getAllContests,
  getContest,
};
