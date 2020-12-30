const { sequelize } = require("../../../models");

const CONTEST_ORDER_CONFIG = [
  ["start_time", "DESC"],
  ["id", "DESC"],
];

async function getAndCountAll({ offset, limit }) {
  const {
    count,
    rows: contests,
  } = await sequelize.models.Contest.findAndCountAll({
    offset,
    limit,
    order: CONTEST_ORDER_CONFIG,
  });
  return { count, contests };
}

async function findOneByContestName(contest_name) {
  return await sequelize.models.Contest.findOne({
    where: { contest_name },
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
  getAndCountAll,
  findOneByContestName,
  createOne,
  updateOneByContestName,
  deleteOneByContestName,
};
