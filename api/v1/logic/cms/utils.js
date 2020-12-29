const { get, post } = require('../../utils/fetch');

const { ERRORS } = require("../../constants");
const { CMS_ERRORS } = require("./constants");
const { LogicError } = require("../../utils/errors");

const { generateToken } = require("./auth");

let cachedCmsToken = null;

async function getCmsToken({ forceRenew=false }) {
  if (cachedCmsToken && !forceRenew) {
    return cachedCmsToken;
  }
  cachedCmsToken = await generateToken();
  return cachedCmsToken;
}

async function fetchWithToken({method, url, data={}, renewToken=false}) {
  const header = {"Authorization": await getCmsToken({forceRenew: renewToken})};
  let body;
  if (method === "GET") {
    body = await get(url, data, header);
  } else {
    body = await post(url, data, header);
  }

  if (body.error === CMS_ERRORS.UNAUTH || body.error === CMS_ERRORS.EXPIRED_TOKEN) {
    if (renewToken) {
      throw new LogicError(ERRORS.CMS_SERVER_ERROR);
    } else {
      // reset token + retry
      await fetchWithToken({ method, url, data, renewToken: true });
    }
  }
  if (body.error === CMS_ERRORS.CMS_SYSTEM_ERROR) {
    throw new LogicError(ERRORS.CMS_SERVER_ERROR);
  }
  return body;
}

module.exports = {
  fetchWithToken,
};
