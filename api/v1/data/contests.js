const { sequelize } = require("../../../models");

const CONTEST_ORDER_CONFIG = [
  ["start_time", "DESC"],
  ["id", "DESC"],
];

async function getAll({ offset, limit }) {
  return await sequelize.models.Contest.findAll({
    offset,
    limit,
    order: CONTEST_ORDER_CONFIG,
  });
}

async function findOneByContestName(contest_name) {
  return await sequelize.models.Contest.findOne({
    where: { contest_name },
  });
}

// TODO: move to data/participations.js
async function getAllParticipationsByUserId(user_id) {
  return await sequelize.models.Participation.findAll({
    where: { user_id },
    include: [
      { model: sequelize.models.Contest, as: "contest" },
      { model: sequelize.models.User, as: "user" },
    ],
  });
}

async function createOne({
  contest_name,
  contest_title,
  start_time,
  duration,
  can_enter,
}) {
  return await sequelize.models.Contest.create({
    contest_name,
    contest_title,
    start_time,
    duration,
    can_enter,
    materials: {},
  });
}

async function updateOneByContestName(contest_name, newContest) {
  const contest = await findOneByContestName(contest_name);
  return await contest.update({ ...contest, ...newContest });
}

async function deleteOneByContestName(contest_name) {
  const contest = await findOneByContestName(contest_name);
  return await contest.destroy();
}

module.exports = {
  getAll,
  findOneByContestName,
  getAllParticipationsByUserId,
  createOne,
  updateOneByContestName,
  deleteOneByContestName,
};
