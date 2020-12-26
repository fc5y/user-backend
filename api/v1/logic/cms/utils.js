const { ERRORS } = require("../../constants");
const { CMS_ERRORS } = require("./errors");
const { LogicError } = require("../../utils/errors");

const { generateToken } = require("./auth");

async function fetchWithToken({method, url, data={}, retry=true}) {
  if (!global.cmsToken) {
    global.cmsToken = await generateToken();
  }
  const header = {
    "Authorization": global.cmsToken,
  };
  const body = await method(url, data, header);
  if (body.error === CMS_ERRORS.UNAUTH.code || body.error === CMS_ERRORS.EXPIRED_TOKEN.code) {
    if (retry) {
      throw new LogicError(ERRORS.CMS_SERVER_ERROR);
    } else {
      // reset token + retry
      global.cmsToken = null;
      await fetchWithToken({ method, url, data, retry: false });
    }
  }
  return body;
}

module.exports = {
  fetchWithToken,
};
