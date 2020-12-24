const commonUtils = require("./common");

function formatContest(contest) {
  const materials = contest.materials || {};
  return {
    contest_name: contest.contest_name,
    contest_title: contest.contest_title,
    start_time: commonUtils.dateToTimestamp(contest.start_time),
    duration: contest.duration,
    total_participation: 0, // TODO: fix this after Participations table is done
    can_enter: contest.can_enter,
    materials: {
      all_materials_url: materials.all_materials_url || "",
      statements_url: materials.statements_url || "",
      test_data_url: materials.test_data_url || "",
      ranking_url: materials.ranking_url || "",
      editorial_url: materials.editorial_url || "",
      solution_url: materials.solution_url || "",
    },
  };
}

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

module.exports = {
  formatContest,
  formatParticipation,
};
