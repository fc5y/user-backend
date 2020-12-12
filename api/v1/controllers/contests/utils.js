function dateToTimestamp(date) {
  return date.getTime() / 1000;
}

function timestampToDate(timestamp) {
  return new Date(timestamp * 1000);
}

function formatContest(contest) {
  const materials = contest.materials || {};
  return {
    contest_name: contest.contest_name,
    contest_title: contest.contest_title,
    start_time: dateToTimestamp(contest.start_time),
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

module.exports = { dateToTimestamp, timestampToDate, formatContest };
