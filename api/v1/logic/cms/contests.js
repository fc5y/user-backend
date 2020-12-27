const CMS_SERVER = process.env.CMS_SERVER;
const { get } = require('../../utils/fetch');
const { ERRORS } = require("../../constants");
const { CMS_ERRORS } = require("./constants");
const { LogicError } = require("../../utils/errors");
const { fetchWithToken } = require('./utils');

async function getContest(contest_name) {
  const url = `${CMS_SERVER}/api/contests/?name=${contest_name}`;
  const body = await fetchWithToken({ method: get, url: url });

  if (body.error && body.error === CMS_ERRORS.NOT_FOUND.code) {
    throw new LogicError(ERRORS.CMS_CONTEST_NOT_FOUND);
  } else if (body.error) {
    throw new LogicError({ ...ERRORS.CMS_FETCH_ERROR, data: { body } });
  }

  const contests = body.data.contests;
  if (contests.length === 0) {
    throw new LogicError(ERRORS.CMS_CONTEST_NOT_FOUND);
  }
  return contests[0];
}

module.exports = {
  getContest,
};
