const { ERRORS } = require("../constants");
const { LogicError } = require("../utils/errors");

const contestData = require("../data/contests");
const participationData = require("../data/participations");

const cmsLogic = require("./cms");

async function getAllContests({ offset, limit }) {
  return await contestData.getAll({ offset, limit });
}

async function getAllParticipationsByUserId(user_id) {
  return await participationData.getAllByUserId({ user_id });
}

async function createContest({
  contest_name,
  contest_title,
  start_time,
  duration,
  can_enter,
}) {
  if (await contestData.findOneByContestName(contest_name)) {
    throw new LogicError(ERRORS.CONTEST_EXISTS);
  }
  return await contestData.createOne({
    contest_name,
    contest_title,
    start_time,
    duration,
    can_enter,
  });
}

async function getContest({ contest_name, user_id = null }) {
  const contest = await contestData.findOneByContestName(contest_name);
  if (contest === null) {
    throw new LogicError(ERRORS.CONTEST_NOT_FOUND);
  }
  const myParticipation = user_id
    ? await participationData.findOne(user_id, contest.id)
    : null;

  return {
    contest,
    myParticipation,
  };
}

async function updateContest({ contest_name }, newContest) {
  const contest = await contestData.findOneByContestName(contest_name);
  if (contest === null) {
    throw new LogicError(ERRORS.CONTEST_NOT_FOUND);
  }
  if (!contest.can_enter && newContest.can_enter) {
    await cmsLogic.syncAll({contest_name: contest_name});
  }
  return await contestData.updateOneByContestName(contest_name, {
    ...contest,
    ...newContest,
  });
}

async function deleteContest({ contest_name }) {
  if ((await contestData.findOneByContestName(contest_name)) === null) {
    throw new LogicError(ERRORS.CONTEST_NOT_FOUND);
  }
  return await contestData.deleteOneByContestName(contest_name);
}

module.exports = {
  getAllContests,
  getAllParticipationsByUserId,
  createContest,
  getContest,
  updateContest,
  deleteContest,
};
