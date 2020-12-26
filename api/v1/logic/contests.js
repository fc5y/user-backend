const { ERRORS } = require("../constants");
const { LogicError } = require("../utils/errors");

const contestData = require("../data/contests");
const participationData = require("../data/participations");
const { cmsUserImportFormat } = require("../utils/participations");

const cmsUserLogic = require("./cms/users");
const cmsContestLogic = require("./cms/contests");

async function getAllContests({ offset, limit }) {
  return await contestData.getAll({ offset, limit });
}

async function getAllParticipationsByUserId(user_id) {
  return await contestData.getAllParticipationsByUserId(user_id);
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

async function getContest({ contest_name }) {
  const contest = await contestData.findOneByContestName(contest_name);
  if (contest === null) {
    throw new LogicError(ERRORS.CONTEST_NOT_FOUND);
  }
  return contest;
}

async function updateContest({ contest_name }, newContest) {
  const contest = await contestData.findOneByContestName(contest_name);
  if (contest === null) {
    throw new LogicError(ERRORS.CONTEST_NOT_FOUND);
  }
  if (!contest.can_enter && newContest.can_enter) {
    const notInCmsParticipations = await participationData.getAllNotInCmsParticipations(contest.id);
    const cmsUsers = notInCmsParticipations.map(cmsUserImportFormat);
    const cmsContest = await cmsContestLogic.getContest(contest_name);

    await cmsUserLogic.importUsers({
      users: cmsUsers,
      contest_id: cmsContest.id,
    });

    // update in_cms = true
    const parIds = notInCmsParticipations.map(x => x.id);
    await participationData.bulkUpdateInCms(parIds);
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
