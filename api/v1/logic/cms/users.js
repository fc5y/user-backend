const { ERRORS } = require("../../constants");
const { LogicError } = require("../../utils/errors");
const { CMS_ERRORS, CMS_APIS } = require("./constants");
const { fetchWithToken } = require('./utils');

const CMS_SERVER = process.env.CMS_SERVER;

async function importUsers({contest_id, users}) {
  const url = CMS_SERVER + CMS_APIS.POST_USERS;
  const data = {
    contest_id,
    users,
  };
  const body = await fetchWithToken({ method: "POST", url: url, data: data });
  if (body.error === CMS_ERRORS.NOT_FOUND) {
    throw new LogicError(ERRORS.CMS_CONTEST_NOT_FOUND);
  }
  if (body.error === CMS_ERRORS.EXISTS) {
    if (users.length === 1) {
      return; // do nothing
    }
    // import one by one
    for (const user of users) {
      await importUsers({contest_id: contest_id, users: [user]});
    }
    return;
  }
  if (body.error) {
    throw new LogicError({ ...ERRORS.CMS_FETCH_ERROR, data: { body } });
  }
}

async function getAll() {
  const url = CMS_SERVER + CMS_APIS.GET_USERS;
  const body = await fetchWithToken({ method: "GET", url: url });
  if (body.error !== 0) {
    throw new LogicError({ ...ERRORS.CMS_FETCH_ERROR, data: { body } });
  }
  return body.data.users;
}

module.exports = {
  importUsers,
  getAll,
};
