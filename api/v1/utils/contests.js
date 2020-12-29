const commonUtils = require("./common");

function formatContest(contest) {
  const materials = contest.materials || {};
  return {
    contest_name: contest.contest_name,
    contest_title: contest.contest_title,
    start_time: commonUtils.dateToTimestamp(contest.start_time),
    duration: contest.duration,
    total_participations:
      typeof contest.total_participations === "number"
        ? contest.total_participations
        : null,
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

module.exports = {
  formatContest,
};
