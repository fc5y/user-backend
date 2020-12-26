const { sequelize } = require("./../../../models");

async function getAllByUserId({ user_id, offset, limit }) {
  const { count, rows: participations } = await sequelize.models.Participation.findAndCountAll({
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

async function getAllNotInCmsParticipations(contest_id) {
  return await sequelize.models.Participation.findAll({
    where: {
      contest_id,
      in_cms: false,
    },
    include: [
      { model: sequelize.models.User, as: "user" },
    ],
  });
}

async function findOne({ user_id, contest_id }) {
  const participation = await sequelize.models.Participation.findOne({
    where: {
      user_id,
      contest_id,
    },
    include: [
      { model: sequelize.models.Contest, as: "contest" },
      { model: sequelize.models.User, as: "user" },
    ],
  });
  return participation;
}

async function create({
  user_id,
  contest_id,
  is_hidden,
  contest_password,
}) {
  return await sequelize.models.Participation.create({
    user_id,
    contest_id,
    is_hidden,
    contest_password,
  });
}

async function bulkUpdateInCms(participation_ids) {
  await sequelize.models.Participation.update(
    { in_cms: true },
    { where: { id: participation_ids } }
  );
}

module.exports = {
  getAllByUserId,
  getAllNotInCmsParticipations,
  findOne,
  create,
  bulkUpdateInCms,
};
