const CMS_ERRORS = {
  CMS_SYSTEM_ERROR: 10001,
  WRONG_PARAMS: 10002,
  EXISTS: 10003,
  NOT_FOUND: 10004,
  UNAUTH: 11000,
  EXPIRED_TOKEN: 11001,
};

const CMS_APIS = {
  GENERATE_TOKEN: "/api/token/generate",
  GET_USERS: "/api/users",
  POST_USERS: "/api/users",
  GET_CONTEST: "/api/contests",
};

module.exports = {
  CMS_ERRORS,
  CMS_APIS,
};
