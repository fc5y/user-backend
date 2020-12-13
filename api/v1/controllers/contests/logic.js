const db = require("../../../../models");
const { ERRORS } = require("./constants");
const { ContestRuntimeError } = require("./errors");

const models = db.sequelize.models;

async function getAllContests(offset, limit) {
  try {
    const contests = await models.Contest.findAll({
      offset,
      limit,
      order: [["start_time", "DESC"]],
    });
    return contests;
  } catch (error) {
    throw new ContestRuntimeError({
      ...ERRORS.SERVER_ERROR,
      data: { message: error.message },
    });
  }
}

async function contestExists(contest_name) {
  const contest = await models.Contest.findOne({ where: { contest_name } });
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
    throw new ContestRuntimeError({
      ...ERRORS.CONTEST_EXISTS,
      data: { contest_name },
    });

  try {
    const contest = await models.Contest.create({
      contest_name,
      contest_title,
      start_time,
      duration,
      can_enter,
      materials: {},
    });
    return contest;
  } catch (error) {
    throw new ContestRuntimeError({
      ...ERRORS.CREATE_CONTEST_ERROR,
      data: { message: error.message },
    });
  }
}

async function getContest({ contest_name }) {
  try {
    return await models.Contest.findOne({ where: { contest_name } });
  } catch (error) {
    throw new ContestRuntimeError({
      ...ERRORS.SERVER_ERROR,
      data: { message: error.message },
    });
  }
}

async function updateContest({ contest_name }, newValue) {
  const contest = await getContest({ contest_name });
  if (contest === null) {
    throw new ContestRuntimeError({
      ...ERRORS.CONTEST_NOT_FOUND,
      data: { contest_name },
    });
  }

  for (const key in newValue) {
    if (newValue[key] !== undefined) {
      contest[key] = newValue[key];
    }
  }
  return await contest.save();
}

module.exports = {
  ContestRuntimeError,
  getAllContests,
  contestExists,
  createContest,
  getContest,
  updateContest,
};
