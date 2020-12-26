function formatUser(user) {
  return {
    username: user.username,
    full_name: user.full_name,
    school_name: user.school_name,
    email: user.email,
    rank_in_global: 0,
    rating: 0,
  };
}

module.exports = {
  formatUser,
};
