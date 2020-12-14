const db = require("../models/index.js");
const models = db.sequelize.models;
const errors = require("../utils/error");
const { statusCode } = require("../utils");

function formatParticipation(participation) {
  return {
    "contest_name": participation.contest.contest_name,
    "contest_title": participation.contest.contest_title,
    // "contest_total_participations": 234,
    "is_hidden": participation.is_hidden,
    "rating": participation.rating,
    "rating_change": participation.rating_change,
    "score": participation.score,
    "rank_in_contest": participation.rank_in_contest,
  };
}

async function isRegistered(user_id, contest_id) {
  const participation = await models.Participation.findOne({
    where: {
      contest_id: contest_id,
      user_id: user_id,
    }
  });
  return participation !== null;
}

// POST /api/v1/participations
async function register(req, res) {
  const user_id = req.user.id;
  const { contest_name, is_hidden } = req.body;
  const contest = await models.Contest.findOne({ where: {contest_name} });
  if (!contest) {
    throw new errors.FcError(errors.CONTEST_NOT_FOUND);
  }
  if (await isRegistered(user_id, contest.id)) {
    return res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "Already registered",
      data: {},
    });
  }
  await models.Participation.create({
    user_id: user_id,
    contest_id: contest.id,
    is_hidden
  });
  res.status(statusCode.SUCCESS).json({
    code: 0,
    msg: "Registered successfully",
    data: {},
  });
}

async function getParticipationByUsername(req, res) {
  const username = req.params;
  const user = await models.User.findOne({ where: username });
  if (!user) {
    throw new errors.FcError(errors.USER_NOT_FOUND);
  }
  const participations = await models.Participation.findAll({
    where: { user_id: user.id } ,
    include: [{
      model: models.Contest,
      as: "contest",
    }]
  });

  res.status(statusCode.SUCCESS).json({
    code: 0,
    msg: "",
    data: {
      total: participations.length,
      participations: participations.map(
          participation => formatParticipation(participation)
      ),
    },
  });
}

module.exports = {
  register,
  getParticipationByUsername
};
