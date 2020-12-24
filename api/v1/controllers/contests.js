const commonUtils = require("../utils/common");
const contestLogic = require("../logic/contests");
const { formatContest } = require("../utils/contests");
const { formatParticipation } = require("../utils/participations");

const MAX_LIMIT_GET_ALL_CONTESTS = 50;

// POST /api/v1/contests
async function createContest(req, res, next) {
  contestLogic
    .createContest({
      contest_name: req.body.contest_name,
      contest_title: req.body.contest_title,
      start_time: commonUtils.timestampToDate(req.body.start_time),
      duration: req.body.duration,
      can_enter: req.body.can_enter === "true",
    })
    .then((contest) => {
      res.json({
        code: 0,
        msg: "Contest created",
        data: {
          contest: formatContest(contest),
          server_time: commonUtils.getTimestampNow(),
        },
      });
    })
    .catch(next);
}

// POST /api/v1/contests/{contest_name}/delete
function deleteContest(req, res, next) {
  contestLogic
    .deleteContest({ contest_name: req.params.contest_name })
    .then(() =>
      res.json({
        code: 0,
        msg: "Contest deleted",
        data: {
          contest_name: req.params.contest_name,
          server_time: commonUtils.getTimestampNow(),
        },
      }),
    )
    .catch(next);
}

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
            ? commonUtils.timestampToDate(req.body.start_time)
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
        msg: "Updated contest",
        data: {
          contest: formatContest(contest),
          server_time: commonUtils.getTimestampNow(),
        },
      }),
    )
    .catch(next);
}

// GET /api/v1/contests?offset={offset}&limit={limit}
function getAllContests(req, res, next) {
  const offset = parseInt(req.query.offset, 10);
  const limit = Math.min(
    parseInt(req.query.limit, 10),
    MAX_LIMIT_GET_ALL_CONTESTS,
  );
  const username = (req.user && req.user.username) || null;

  Promise.all([
    contestLogic.getAllContests(offset, limit),
    contestLogic.getAllMyParticipations({ username }),
  ])
    .then(([contests, myParticipations]) => {
      res.send({
        code: 0,
        msg: "Contest",
        data: {
          contests: contests.map(formatContest),
          my_participations: myParticipations
            .filter((p) => contests.some((c) => c.id === p.contest_id))
            .map(formatParticipation),
          server_time: commonUtils.getTimestampNow(),
        },
      });
    })
    .catch(next);
}

// GET /api/v1/contests/{contest_name}
function getContest(req, res, next) {
  contestLogic
    .getContest({ contest_name: req.params.contest_name })
    .then((contest) =>
      res.json({
        code: 0,
        msg: "Contest",
        data: {
          contest: formatContest(contest),
          server_time: commonUtils.getTimestampNow(),
        },
      }),
    )
    .catch(next);
}

module.exports = {
  createContest,
  deleteContest,
  updateContest,
  getAllContests,
  getContest,
};
