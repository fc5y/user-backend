const express = require("express");

const { ERRORS } = require("./constants");
const { LogicError } = require("./utils/errors");
const contestController = require("./controllers/contests");
const { requireAdminRole } = require("./utils/common");

const router = express.Router();

// GET /api/v1/contests
router.get(
  "/contests",
  contestController.getAllContests.validator,
  contestController.getAllContests,
);

// POST /api/v1/contests
router.post(
  "/contests",
  requireAdminRole,
  contestController.createContest.validator,
  contestController.createContest,
);

// GET /api/v1/contests/{contest_name}
router.get(
  "/contests/:contest_name",
  contestController.getContest.validator,
  contestController.getContest,
);

// POST /api/v1/contests/{contest_name}
router.post(
  "/contests/:contest_name",
  requireAdminRole,
  contestController.updateContest.validator,
  contestController.updateContest,
);

// POST /api/v1/contests/{contest_name}/delete
router.post(
  "/contests/:contest_name/delete",
  requireAdminRole,
  contestController.deleteContest.validator,
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
