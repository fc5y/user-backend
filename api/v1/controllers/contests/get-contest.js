const { param } = require("express-validator");
const utils = require("./utils");
const contestLogic = require("../../logic/contests");

const SUCCESS_MESSAGE = "Contest";

// GET /api/v1/contests/{contest_name}
function getContest(req, res, next) {
  contestLogic
    .getContest({ contest_name: req.params.contest_name })
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
getContest.validator = [
  param("contest_name")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .isLength({ min: 1, max: 255 }),
  utils.validationMiddleware,
];

module.exports = getContest;
