const { query } = require("express-validator");
const utils = require("./utils");
const contestLogic = require("../../logic/contests");

const SUCCESS_MESSAGE = "Contests";
const MAX_LIMIT_GET_ALL_CONTESTS = 50;

// GET /api/v1/contests?offset={offset}&limit={limit}
function getAllContests(req, res, next) {
  contestLogic
    .getAllContests(
      parseInt(req.query.offset, 10),
      Math.min(parseInt(req.query.limit, 10), MAX_LIMIT_GET_ALL_CONTESTS),
    )
    .then((contests) => {
      res.json({
        code: 0,
        msg: SUCCESS_MESSAGE,
        data: {
          contests: contests.map(utils.formatContest),
          server_time: utils.dateToTimestamp(Date()),
        },
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

module.exports = getAllContests;
