const express = require("express");

const { ERRORS } = require("./constants");
const { LogicError } = require("./utils/errors");
const contestController = require("./controllers/contests");
const contestValidator = require("./validators/contests");
const { requireAdminRole } = require("./validators/common");

const router = express.Router();

// GET /api/v1/contests
router.get(
  "/contests",
  contestValidator.getAllContests,
  contestController.getAllContests,
);

// POST /api/v1/contests
router.post(
  "/contests",
  requireAdminRole,
  contestValidator.createContest,
  contestController.createContest,
);

// GET /api/v1/contests/{contest_name}
router.get(
  "/contests/:contest_name",
  contestValidator.getContest,
  contestController.getContest,
);

// POST /api/v1/contests/{contest_name}
router.post(
  "/contests/:contest_name",
  requireAdminRole,
  contestValidator.updateContest,
  contestController.updateContest,
);

// POST /api/v1/contests/{contest_name}/delete
router.post(
  "/contests/:contest_name/delete",
  requireAdminRole,
  contestValidator.deleteContest,
  contestController.deleteContest,
);

router.use((error, req, res, _next) => {
  if (error instanceof LogicError) {
    res.status(400).json(error);
  } else {
    res.status(500).json({
      ...ERRORS.SERVER_ERROR,
      data: { message: error.message },
    });
  }
});

module.exports = router;
