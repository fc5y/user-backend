const { ERRORS } = require("../constants");
const { LogicError } = require("../utils/errors");
const { dateToTimestamp, getTimestampNow } = require("../utils/common");

const contestData = require("./../data/contests");
const participationData = require("../data/participations");
const userData = require("../data/users");
const { generateContestPassword } = require("../utils/participations");

async function register(user_id, contest_name, is_hidden) {
  const contest = await contestData.findOneByContestName(contest_name);
  if (!contest) {
    throw new LogicError(ERRORS.CONTEST_NOT_FOUND);
  }
  const participation = await participationData.findOne(user_id, contest.id);
  if (participation) {
    return participation;
  }

  const contest_password = generateContestPassword();
  return await participationData.create({
    user_id: user_id,
    contest_id: contest.id,
    is_hidden: is_hidden,
    contest_password: contest_password,
  });
}

async function getAllByUsername({ username, offset, limit }) {
  const user = await userData.findOneByUsername(username);
  if (!user) {
    throw new LogicError(ERRORS.USER_NOT_FOUND);
  }
  // return {count, participations}
  return await participationData.getAllByUserId({
    user_id: user.id,
    offset,
    limit,
  });
}

async function getCredential(user_id, contest_name) {
  const contest = await contestData.findOneByContestName(contest_name);
  if (!contest) {
    throw new LogicError(ERRORS.CONTEST_NOT_FOUND);
  }
  if (!contest.can_enter) {
    throw new LogicError(ERRORS.CANNOT_ENTER_CONTEST);
  }
  const participation = await participationData.findOne(user_id, contest.id);
  if (!participation) {
    throw new LogicError(ERRORS.NOT_REGISTERED_YET);
  }
  if (!participation.synced) {
    throw new LogicError(ERRORS.NOT_SYNCED_YET);
  }
  return participation;
}

module.exports = {
  register,
  getAllByUsername,
  getCredential,
};
