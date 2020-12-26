const CMS_SERVER = process.env.CMS_SERVER;
const { post } = require('../../utils/fetch');
const { ERRORS } = require("../../constants");
const { LogicError } = require("../../utils/errors");
const { CMS_ERRORS } = require("./errors");
const { fetchWithToken } = require('./utils');

async function importUsers({users, contest_id}) {
  const url = `${CMS_SERVER}/api/users/`;
  const data = {
    contest_id,
    users,
  };
  const body = await fetchWithToken({ method: post, url: url, data: data });
  if (body.error === CMS_ERRORS.NOT_FOUND.code) {
    throw new LogicError(ERRORS.CMS_CONTEST_NOT_FOUND);
  }
  if (body.error === CMS_ERRORS.EXISTS.code) {
    throw new LogicError(ERRORS.CMS_USER_EXISTS);
  }
  if (body.error != 0) {
    throw new LogicError(ERRORS.ERROR_SYSTEM);
  }
}

module.exports = {
  importUsers,
};
