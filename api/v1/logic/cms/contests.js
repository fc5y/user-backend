const CMS_SERVER = process.env.CMS_SERVER;
const { get } = require('../../utils/fetch');
const { generateToken } = require("./auth");
const { ERRORS } = require("../../constants");
const { LogicError } = require("../../utils/errors");

async function getContest(contest_name) {
  const url = `${CMS_SERVER}/api/contest/?name=${contest_name}`;
  if (!global.cmsToken) {
    global.cmsToken = await generateToken();
  }
  const header = {
    "Authorization": global.cmsToken,
  };
  const body = await get(url, header);
  if (body.error != 0) {
    throw new LogicError({
      ...ERRORS.SERVER_ERROR,
      data: { body },
    });
  }
  const contests = body.data;
  if (contests.length === 0) {
    throw new LogicError({
      ...ERRORS.SERVER_ERROR,
      data: { msg:"Contest not found" },
    });
  }

  return contests[0];
}

module.exports = {
  getContest,
};
