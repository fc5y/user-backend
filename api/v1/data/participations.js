const { sequelize } = require("../../../models");

async function getAllByUserId({ user_id, offset, limit }) {
  const {
    count,
    rows: participations,
  } = await sequelize.models.Participation.findAndCountAll({
    offset,
    limit,
    where: { user_id: user_id },
    include: [
      { model: sequelize.models.Contest, as: "contest" },
      { model: sequelize.models.User, as: "user" },
    ],
  });
  return { count, participations };
}

// TODO: Potential performance issue here. Cache before the DB becomes big.
async function countAllByContestId(contest_id) {
  return await sequelize.models.Participation.count({ where: { contest_id } });
}

async function findOne({ user_id, contest_id }) {
  return await sequelize.models.Participation.findOne({
    where: {
      user_id,
      contest_id,
    },
    include: [
      { model: sequelize.models.Contest, as: "contest" },
      { model: sequelize.models.User, as: "user" },
    ],
  });
}

async function create({ user_id, contest_id, is_hidden, contest_password }) {
  return await sequelize.models.Participation.create({
    user_id,
    contest_id,
    is_hidden,
    contest_password,
  });
}

async function bulkUpdateSynced(participationIds) {
  await sequelize.models.Participation.update(
    { synced: true },
    { where: { id: participationIds } },
  );
}

async function getAllByContestId(contest_id) {
  return await sequelize.models.Participation.findAll({
    where: { contest_id },
    include: [{ model: sequelize.models.User, as: "user" }],
  });
}

module.exports = {
  getAllByUserId,
  countAllByContestId,
  findOne,
  create,
  bulkUpdateSynced,
  getAllByContestId,
};
