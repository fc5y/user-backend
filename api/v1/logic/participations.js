const otpGenerator = require("otp-generator");

const { ERRORS } = require("../constants");
const { LogicError } = require("../utils/errors");

const contestLogic = require("./contests");
const participationData = require("../data/participations");

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

module.exports = {
  register,
};
