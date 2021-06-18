const { ERRORS } = require("../constants");
const { LogicError } = require("../utils/errors");

const contestData = require("../data/contests");
const participationData = require("../data/participations");

async function toPlainContestObject(
  contest,
  { includeDerivedFields = true } = {},
) {
  if (!includeDerivedFields) return contest.toJSON();
  return {
    ...contest.toJSON(),
    total_participations: -1,
  };
}

const cmsLogic = require("./cms");

async function getAndCountAll({ offset, limit }) {
  // return {count, contests}
  const { count, contests } = await contestData.getAndCountAll({
    offset,
    limit,
  });
  return {
    count: count,
    contests: await Promise.all(contests.map(toPlainContestObject)),
  };
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
  const contest = await contestData.createOne({
    contest_name,
    contest_title,
    start_time,
    duration,
    can_enter,
  });
  return await toPlainContestObject(contest);
}

async function getContest({ contest_name, user_id = null }) {
  const contest = await contestData.findOneByContestName(contest_name);
  if (contest === null) {
    throw new LogicError(ERRORS.CONTEST_NOT_FOUND);
  }
  const myParticipation = user_id
    ? await participationData.findOne({ user_id, contest_id: contest.id })
    : null;

  return {
    contest: await toPlainContestObject(contest),
    myParticipation,
  };
}

async function updateContest({ contest_name }, changes) {
  const oldContest = await contestData.findOneByContestName(contest_name);
  if (oldContest === null) {
    throw new LogicError(ERRORS.CONTEST_NOT_FOUND);
  }
  if (!oldContest.can_enter && changes.can_enter) {
    await cmsLogic.syncAll({ contest_name: contest_name });
  }
  const newContest = await contestData.updateOneByContestName(contest_name, {
    ...oldContest,
    ...changes,
  });
  return await toPlainContestObject(newContest);
}

async function deleteContest({ contest_name }) {
  if ((await contestData.findOneByContestName(contest_name)) === null) {
    throw new LogicError(ERRORS.CONTEST_NOT_FOUND);
  }
  return await contestData.deleteOneByContestName(contest_name);
}

module.exports = {
  getAndCountAll,
  getAllParticipationsByUserId,
  createContest,
  getContest,
  updateContest,
  deleteContest,
};
