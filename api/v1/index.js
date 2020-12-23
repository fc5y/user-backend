const express = require("express");
const router = express.Router();

const contestController = require("./controllers/contests");

const contestValidator = require("./validators/contests");

const { LogicError } = require("./utils/errors");
const { ERRORS } = require("./constants");

// Contest APIs
// GET /api/v1/contests
router.get(
  "/contests",
  contestValidator.getAllContests,
  contestController.getAllContests,
);

// POST /api/v1/contests
router.post(
  "/contests",
  // add admin account check here
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
  contestValidator.updateContest,
  contestController.updateContest,
);

// POST /api/v1/contests/{contest_name}/delete
router.post(
  "/contests/:contest_name/delete",
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
