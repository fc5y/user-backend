const CMS_SERVER = process.env.CMS_SERVER;
const { post, get } = require('../../utils/fetch');
const { ERRORS } = require("../../constants");
const { LogicError } = require("../../utils/errors");
const { CMS_ERRORS } = require("./constants");
const { fetchWithToken } = require('./utils');

async function importUsers({contest_id, users}) {
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
    // throw new LogicError(ERRORS.CMS_USER_EXISTS);
    // TODO: REcall
    return;
  }
  if (body.error) {
    throw new LogicError({ ...ERRORS.CMS_FETCH_ERROR, data: { body } });
  }
}

async function getAll() {
  const url = `${CMS_SERVER}/api/users/`;
  const body = await fetchWithToken({ method: get, url: url });
  if (body.error !== 0) {
    throw new LogicError({ ...ERRORS.CMS_FETCH_ERROR, data: { body } });
  }
  return body.data;
}

module.exports = {
  importUsers,
  getAll,
};
