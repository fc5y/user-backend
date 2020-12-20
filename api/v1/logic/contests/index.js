const { sequelize } = require("../../../../models");
const { ERRORS } = require("../../constants");
const { LogicError } = require("../../utils/error-classes");

async function getAllContests(offset, limit) {
  const contests = await sequelize.models.Contest.findAll({
    offset,
    limit,
    order: [["start_time", "DESC"]],
  });
  return contests;
}

async function contestExists(contest_name) {
  const contest = await sequelize.models.Contest.findOne({
    where: { contest_name },
  });
  return contest !== null;
}

async function createContest({
  contest_name,
  contest_title,
  start_time,
  duration,
  can_enter,
}) {
  if (await contestExists(contest_name))
    throw new LogicError({
      ...ERRORS.CONTEST_EXISTS,
      data: { contest_name },
    });

  const contest = await sequelize.models.Contest.create({
    contest_name,
    contest_title,
    start_time,
    duration,
    can_enter,
    materials: {},
  });
  return contest;
}

async function getContest({ contest_name }) {
  const contest = await sequelize.models.Contest.findOne({
    where: { contest_name },
  });
  if (contest === null) {
    throw new LogicError({
      ...ERRORS.CONTEST_NOT_FOUND,
      data: { contest_name },
    });
  }
  return contest;
}

async function updateContest({ contest_name }, newValue) {
  const contest = await getContest({ contest_name });

  for (const key in newValue) {
    if (newValue[key] !== undefined) {
      contest[key] = newValue[key];
    }
  }
  return await contest.save();
}

async function deleteContest({ contest_name }) {
  const contest = await getContest({ contest_name });
  return await contest.destroy();
}

module.exports = {
  getAllContests,
  contestExists,
  createContest,
  getContest,
  updateContest,
  deleteContest,
};
