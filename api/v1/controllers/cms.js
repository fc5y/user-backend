const cmsLogic = require("./../logic/cms");
const commonUtils = require("../utils/common");

// POST /api/v1/cms/syncAll
function syncAll(req, res, next) {
  cmsLogic.syncAll({ contest_name: req.params.contest_name })
  .then(() => {
    res.json({
      code: 0,
      msg: "Synced successfully",
      data: {
        server_time: commonUtils.getTimestampNow(),
      },
    });
  })
  .catch(next);
}

module.exports = {
  syncAll,
};
