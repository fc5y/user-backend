const { ERRORS } = require("../../constants");
const { LogicError } = require("../../utils/errors");

const cmsContestLogic = require("./contests");
const cmsUserLogic = require("./users");
const participationData = require("../../data/participations");
const contestData = require("../../data/contests");

async function syncAll({contest_name, whitelistedParticipations=null}) {
  const contest = await contestData.findOneByContestName(contest_name);
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
    let syncedUsers = await cmsUserLogic.getAll();
    syncedUsers = syncedUsers.filter(user => user.contest_id === cmsContest.id);
    const syncedUsernames = new Set(syncedUsers.map(x => x.username));

    // update all synced users
    await participationData.bulkUpdateSynced(syncedUsers.map(user => user.id));

    // 3. fetch all users that registered this contest (2)
    const participations = await participationData.getAllByContestId(contest.id);
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
  await participationData.bulkUpdateSynced(toBeSyncedParticipations.map(user => user.id));
}

module.exports = {
  syncAll,
};
