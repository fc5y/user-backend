const CMS_SERVER = process.env.CMS_SERVER;
const { post } = require('../../utils/fetch');
const { generateToken } = require("./auth");
const { ERRORS } = require("../../constants");
const { LogicError } = require("../../utils/errors");

async function importUsers({users, contest_id}) {
  const url = `${CMS_SERVER}/api/users/`;
  const data = {
    contest_id,
    users,
  };
  if (!global.cmsToken) {
    global.cmsToken = await generateToken();
  }
  const header = {
    "Authorization": global.cmsToken,
  };
  const body = await post(url, data, header);
  if (body.error != 0 && body.error != 10003) {
    throw new LogicError({
      ...ERRORS.SERVER_ERROR,
      data: { body },
    });
  }
}

module.exports = {
  generateToken,
  importUsers,
};
