const commonUtils = require("../utils/common");

const participationLogic = require("../logic/participations");

// POST /api/v1/participation
async function register(req, res, next) {
  const user_id = req.user.id;
  participationLogic.register(req.user.id, req.body.contest_name, req.body.is_hidden)
  .then((participation) => {
    res.json({
      code: 0,
      msg: "Registered sucessfully",
      data: {
        server_time: commonUtils.getTimestampNow(),
      },
    });
  })
  .catch(next);
}

module.exports = {
  register,
};
