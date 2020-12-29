const { post } = require('../../utils/fetch');
const { ERRORS } = require("../../constants");
const { LogicError } = require("../../utils/errors");
const { CMS_APIS } = require("./constants");

const CMS_SERVER = process.env.CMS_SERVER;
const CMS_SIGNATURE = process.env.CMS_SIGNATURE;

async function generateToken() {
  const url = CMS_SERVER + CMS_APIS.GENERATE_TOKEN;
  const data = { signature: CMS_SIGNATURE };
  const body = await post(url, data);
  if (body.error) {
    throw new LogicError({ ...ERRORS.CMS_FETCH_ERROR, data: { body } });
  }
  return body.data.token;
}

module.exports = {
  generateToken,
};
