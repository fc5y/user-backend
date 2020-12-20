const { param, body } = require("express-validator");
const utils = require("./utils");
const contestLogic = require("../../logic/contests");

const SUCCESS_MESSAGE = "Contest updated";

// POST /api/v1/contests/{contest_name}
function updateContest(req, res, next) {
  const materials = req.body.materials || {};
  contestLogic
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
        msg: SUCCESS_MESSAGE,
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

module.exports = updateContest;
