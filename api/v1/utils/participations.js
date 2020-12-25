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
  formatParticipation,
};
