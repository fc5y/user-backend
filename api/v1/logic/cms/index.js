const { ERRORS } = require("./constants");
const { LogicError } = require("../../utils/errors");

const cmsContestLogic = require("./contests");
const cmsUserLogic = require("./users");
const participationData = require("../../data/participations");
const contestData = require("../../data/contests");

async function syncAll({contest_name, whitelistedParticipations=null}) {
  const contest = await contestData.updateOneByContestName(contest_name);
  if (!contest) {
    throw new LogicError(ERRORS.CONTEST_NOT_FOUND);
  }
  // 1. check if cms contest exists
  const cmsContest = await cmsContestLogic.getContest(contest_name);
  // throw error in get CMS Contest function

  // skip these steps if forcedUsers is not empty
  let toBeSyncedParticipations;
  if (whitelistedParticipations) {
    toBeSyncedParticipations = whitelistedParticipations;
  } else {
    // 2. fetch all users that already in CMS contest (1)
    const syncedUsers = await cmsUserLogic.getAll();
    const syncedUsernames = new Set(syncedUsers.map(x => x.username));
    // 3. fetch all users that registered this contest (2)
    const participations = await participationData.getRegisteredByContestId(contest.id);
    toBeSyncedParticipations = participations.filter(p => !syncedUsernames.has(p.user.username));
    if (toBeSyncedParticipations.length === 0) {
      return;
    }
  }
  // 4. add to cms manager
  const toBeSyncedUsers = toBeSyncedParticipations.map((participation) => {
    return {
      password: participation.contest_password,
      username: participation.user.username,
      first_name: participation.user.full_name,
      last_name: participation.user.school_name,
    };
  });
  await cmsUserLogic.importUsers({
    contest_id: cmsContest.id,
    users: toBeSyncedUsers,
  });
  // 5. Update 'synced' column
  await participationData.bulkUpdateSynced(toBeSyncedParticipations.map(x => x.id));
}

module.exports = {
  syncAll,
};
