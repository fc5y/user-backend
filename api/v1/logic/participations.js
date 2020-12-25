const otpGenerator = require("otp-generator");

const { ERRORS } = require("../constants");
const { LogicError } = require("../utils/errors");

const contestLogic = require("./contests");
const participationData = require("../data/participations");
const userData = require("../data/users");

function generateContestPassword() {
  // fc-xxxxxx
  return "fc-" + otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
}

async function register(user_id, contest_name, is_hidden) {
  const contest = await contestLogic.getContest({ contest_name: contest_name });
  if (!contest) {
    throw new LogicError({
      ...ERRORS.CONTEST_NOT_FOUND,
      data: { contest_name },
    });
  }
  const participation = await participationData.findOne(user_id, contest.id);
  if (participation) {
    return participation;
  }

  const contest_password = generateContestPassword();
  return await participationData.create(
    user_id,
    contest.id,
    is_hidden,
    contest_password,
  );
}

async function getAllByUsername(username) {
  const user = await userData.findOneByUsername(username);
  if (!user) {
    throw new LogicError({
      ...ERRORS.USER_NOT_FOUND,
      data: { username },
    });
  }
  return await participationData.getAllByUserId(user.id);
}

async function getCredential(user_id, contest_name) {
  const contest = await contestLogic.getContest({ contest_name: contest_name });
  if (!contest) {
    throw new LogicError({
      ...ERRORS.CONTEST_NOT_FOUND,
      data: { contest_name },
    });
  }
  const participation = await participationData.findOne(user_id, contest.id);
  if (!participation) {
    throw new LogicError({
      ...ERRORS.NOT_REGISTERED_YET,
      data: { contest_name },
    });
  }
  return participation;
}

module.exports = {
  register,
  getAllByUsername,
  getCredential,
};
