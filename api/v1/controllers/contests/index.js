const { query, param, body } = require("express-validator");
const utils = require("./utils");
const logic = require("./logic");
const constants = require("./constants");
const { ERRORS } = require("../../constants");
const { validationMiddleware } = require("./utils");

// GET /api/v1/contests?offset={offset}&limit={limit}
function getAllContests(req, res, next) {
  logic
    .getAllContests(
      parseInt(req.query.offset, 10),
      Math.min(
        parseInt(req.query.limit, 10),
        constants.MAX_LIMIT_GET_ALL_CONTESTS,
      ),
    )
    .then((contests) => {
      res.json({
        code: 0,
        msg: constants.SUCCESS_MESSAGE.GET_ALL_CONTESTS,
        data: { contests: contests.map(utils.formatContest) },
      });
    })
    .catch(next);
}

// optional, for validation only
getAllContests.validator = [
  query("offset").isInt({ min: 0 }),
  query("limit").isInt({ min: 0 }),
  utils.validationMiddleware,
];

// POST /api/v1/contests
async function createContest(req, res, next) {
  logic
    .createContest({
      contest_name: req.body.contest_name,
      contest_title: req.body.contest_title,
      start_time: utils.timestampToDate(req.body.start_time),
      duration: req.body.duration,
      can_enter: req.body.can_enter === "true",
    })
    .then((contest) => {
      res.json({
        code: 0,
        msg: constants.SUCCESS_MESSAGE.CREATE_CONTEST,
        data: { contest: utils.formatContest(contest) },
      });
    })
    .catch(next);
}

// optional, for validation only
createContest.validator = [
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
  utils.validationMiddleware,
];

// GET /api/v1/contests/{contest_name}
function getContest(req, res, next) {
  logic
    .getContest({ contest_name: req.params.contest_name })
    .then((contest) =>
      res.json({
        code: 0,
        msg: constants.SUCCESS_MESSAGE.GET_CONTEST,
        data: { contest: utils.formatContest(contest) },
      }),
    )
    .catch(next);
}

// optional, for validation only
getContest.validator = [
  param("contest_name")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .isLength({ min: 1, max: 255 }),
  utils.validationMiddleware,
];

// POST /api/v1/contests/{contest_name}
function updateContest(req, res, next) {
  const materials = req.body.materials || {};
  logic
    .updateContest(
      { contest_name: req.params.contest_name },
      {
        contest_name: req.body.contest_name,
        contest_title: req.body.contest_title,
        start_time:
          req.body.start_time !== undefined
            ? utils.timestampToDate(req.body.start_time)
            : undefined,
        duration: req.body.duration,
        can_enter: req.body.can_enter,
        materials: {
          all_materials_url: materials.all_materials_url,
          statements_url: materials.statements_url,
          test_data_url: materials.test_data_url,
          ranking_url: materials.ranking_url,
          editorial_url: materials.editorial_url,
          solution_url: materials.solution_url,
        },
      },
    )
    .then((contest) =>
      res.json({
        code: 0,
        msg: constants.SUCCESS_MESSAGE.UPDATE_CONTEST,
        data: { contest: utils.formatContest(contest) },
      }),
    )
    .catch(next);
}

// optional, for validation only
updateContest.validator = [
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
  utils.validationMiddleware,
];

// POST /api/v1/contests/{contest_name}/delete
function deleteContest(req, res, next) {
  logic
    .deleteContest({ contest_name: req.params.contest_name })
    .then(() =>
      res.json({
        code: 0,
        msg: constants.SUCCESS_MESSAGE.DELETE_CONTEST,
        data: { contest_name: req.params.contest_name },
      }),
    )
    .catch(next);
}

// optional, for validation only
deleteContest.validator = [
  param("contest_name")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("value must only contain allowed characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("value's length must be in range 1 to 255"),
  validationMiddleware,
];

module.exports = {
  getAllContests,
  createContest,
  getContest,
  updateContest,
  deleteContest,
};
