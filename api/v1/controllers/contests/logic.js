const db = require("../../../../models");
const { ERRORS } = require("./constants");
const models = db.sequelize.models;

class ContestLogicError extends Error {
  constructor({ code, msg, data }, ...params) {
    super(...params);
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}

async function getAllContests(offset, limit) {
  try {
    const contests = await models.Contest.findAll({
      offset,
      limit,
      order: [["start_time", "DESC"]],
    });
    return contests;
  } catch (error) {
    throw new ContestLogicError({
      ...ERRORS.GET_CONTESTS_ERROR,
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
    throw new ContestLogicError({
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
    throw new ContestLogicError({
      ...ERRORS.CREATE_CONTEST_ERROR,
      data: { message: error.message },
    });
  }
}

module.exports = {
  ContestLogicError,
  getAllContests,
  contestExists,
  createContest,
};
