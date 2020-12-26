const CMS_SERVER = process.env.CMS_SERVER;
const CMS_SIGNATURE = process.env.CMS_SIGNATURE;
const { post } = require('../../utils/fetch');
const { ERRORS } = require("../../constants");
const { LogicError } = require("../../utils/errors");

async function generateToken() {
  const url = `${CMS_SERVER}/api/token/generate/`;
  const data = { signature: CMS_SIGNATURE };
  const body = await post(url, data);
  if (body.error != 0) {
    throw new LogicError(ERRORS.SERVER_ERROR);
  }
  return body.data.token;
}

module.exports = {
  generateToken,
};
