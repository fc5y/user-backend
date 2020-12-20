const { body } = require("express-validator");
const utils = require("./utils");
const contestLogic = require("../../logic/contests");

const SUCCESS_MESSAGE = "Contest created";

// POST /api/v1/contests
async function createContest(req, res, next) {
  contestLogic
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
        msg: SUCCESS_MESSAGE,
        data: {
          contest: utils.formatContest(contest),
          server_time: utils.dateToTimestamp(new Date()),
        },
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

module.exports = createContest;
