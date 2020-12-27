const otpGenerator = require("otp-generator");

function formatParticipation(participation) {
  return {
    username: participation.user.username,
    contest_name: participation.contest.contest_name,
    contest_title: participation.contest.contest_title,
    contest_total_participation: 0, // TODO: fix this
    is_hidden: participation.is_hidden,
    rating: participation.rating,
    rating_change: participation.rating_change,
    score: participation.score,
    rank_in_contest: participation.rank_in_contest,
  };
}

function generateContestPassword() {
  // fc-xxxxxx
  return "fc-" + otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
}

function cmsUserImportFormat(participation) {
  return {
    password: participation.contest_password,
    username: participation.user.username,
    last_name: participation.user.full_name,
    first_name: participation.user.school_name,
  };
}

module.exports = {
  formatParticipation,
  generateContestPassword,
  cmsUserImportFormat,
};
