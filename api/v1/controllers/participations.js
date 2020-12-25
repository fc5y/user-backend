const commonUtils = require("../utils/common");
const { formatParticipation } = require("../utils/participations");
const participationLogic = require("../logic/participations");

// POST /api/v1/participation
async function register(req, res, next) {
  participationLogic.register(req.user.id, req.body.contest_name, req.body.is_hidden)
  .then(() => {
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

async function getAllByUsername(req, res, next) {
  const username = req.params;
  participationLogic.getAllByUsername(username)
  .then((participations) => {
    res.json({
      code: 0,
      msg: "",
      data: {
        total: participations.length,
        participations: participations.map(formatParticipation),
      },
    });
  })
  .catch(next);
}

module.exports = {
  register,
  getAllByUsername,
};
