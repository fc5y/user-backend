const { param } = require("express-validator");
const utils = require("./utils");
const contestLogic = require("../../logic/contests");

const SUCCESS_MESSAGE = "Contest deleted";

// POST /api/v1/contests/{contest_name}/delete
function deleteContest(req, res, next) {
  contestLogic
    .deleteContest({ contest_name: req.params.contest_name })
    .then(() =>
      res.json({
        code: 0,
        msg: SUCCESS_MESSAGE,
        data: {
          contest_name: req.params.contest_name,
          server_time: utils.dateToTimestamp(new Date()),
        },
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
  utils.validationMiddleware,
];

module.exports = deleteContest;
