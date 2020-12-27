const { ERRORS } = require("../../constants");
const { CMS_ERRORS } = require("./constants");
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
  if (body.error === CMS_ERRORS.CMS_SYSTEM_ERROR.code) {
    throw new LogicError(ERRORS.CMS_SERVER_ERROR);
  }
  if (body.error) {
    throw new LogicError({ ...ERRORS.CMS_FETCH_ERROR, data: { body } });
  }
  return body;
}

module.exports = {
  fetchWithToken,
};
