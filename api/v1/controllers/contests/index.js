const { query, body } = require("express-validator");
const utils = require("./utils");
const logic = require("./logic");
const constants = require("./constants");

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
        msg: constants.DEFAULT_MESSAGE.GET_ALL_CONTESTS,
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
        msg: constants.DEFAULT_MESSAGE.CREATE_CONTEST,
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
  body("start_time").isInt(),
  body("duration").isInt(),
  body("can_enter").isIn(["true", "false"]),
  utils.validationMiddleware,
];

module.exports = {
  getAllContests,
  createContest,
};
