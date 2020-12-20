const db = require("../models/index.js");
const models = db.sequelize.models;
const errors = require("../utils/error");
const { statusCode } = require("../utils");
const otpGenerator = require("otp-generator");

function formatParticipation(participation) {
  return {
    "contest_name": participation.contest.contest_name,
    "contest_title": participation.contest.contest_title,
    "contest_total_participations": 0, // TODO: Get number of participations in a contest
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

function generateCmsPassword() {
  // fc-xxxxxx
  return "fc-" + otpGenerator.generate(6, {
    specialChars: false,
  });
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
  const cms_password = generateCmsPassword();
  await models.Participation.create({
    user_id: user_id,
    contest_id: contest.id,
    is_hidden,
    cms_password: cms_password,
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

async function getCredential(req, res) {
  const contest_name = req.params;
  const contest = await models.Contest.findOne({ where: contest_name });
  if (!contest) {
    throw new errors.FcError(errors.CONTEST_NOT_FOUND);
  }
  const participation = await models.Participation.findOne({
    where: {
      user_id: req.user.id,
      contest_id: contest.id
    }
  });
  if (!participation) {
    throw new errors.FcError(errors.NOT_REGISTERED_YET);
  }
  res.status(statusCode.SUCCESS).json({
    code: 0,
    msg: "",
    data: {
      contest_username: req.user.username,
      contest_password: participation.cms_password,
    },
  });
}

module.exports = {
  register,
  getParticipationByUsername,
  getCredential,
};
