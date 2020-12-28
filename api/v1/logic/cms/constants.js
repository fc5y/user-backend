const CMS_ERRORS = {
  CMS_SYSTEM_ERROR: {
    code: 10001,
  },
  WRONG_PARAMS: {
    code: 10002,
  },
  EXISTS: {
    code: 10003,
  },
  NOT_FOUND: {
    code: 10004,
  },
  UNAUTH: {
    code: 11000,
  },
  EXPIRED_TOKEN: {
    code: 11001,
  },
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
