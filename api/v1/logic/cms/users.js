const CMS_SERVER = process.env.CMS_SERVER;
const CMS_SIGNATURE = process.env.CMS_SIGNATURE;
const { get, post } = require('../../utils/fetch');
const fetch = require("node-fetch");
const { generateToken } = require("./auth");
const { ERRORS } = require("../constants");
const { LogicError } = require("../utils/errors");

async function importUsers(contestUsers, contest_id) {
  const url = `${CMS_SERVER}/api/users/`;
  const data = {
    "contest_id": contest_id,
    "users": contestUsers,
  };
  console.log(data);
  if (!global.cmsToken) {
    global.cmsToken = await generateToken();
  }
  const header = {
    "Authorization": global.cmsToken,
  };
  const body = await post(url, data, header);
  // if (body.error != 0) {
  //   if (user === null) {
  //     throw new LogicError(ERRORS.SERVER_ERROR);
  //   }
  // }
  // return body.data.token;
  console.log(body);
}

module.exports = {
  generateToken,
  importUsers,
};
