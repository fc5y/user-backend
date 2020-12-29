const { ERRORS } = require("../../constants");
const { CMS_ERRORS, CMS_APIS } = require("./constants");
const { LogicError } = require("../../utils/errors");
const { fetchWithToken } = require('./utils');

const CMS_SERVER = process.env.CMS_SERVER;

async function getContest(contest_name) {
  const url = `${CMS_SERVER}${CMS_APIS.GET_CONTEST}?name=${encodeURIComponent(contest_name)}`;
  const body = await fetchWithToken({ method: "GET", url: url });

  if (body.error === CMS_ERRORS.NOT_FOUND) {
    throw new LogicError(ERRORS.CMS_CONTEST_NOT_FOUND);
  }
  if (body.error) {
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
