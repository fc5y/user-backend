const express = require("express");
const contestController = require("./controllers/contests");
const { LogicError } = require("./utils/error-classes");
const { ERRORS } = require("./constants");

const router = express.Router();

// GET /api/v1/hello
router.get("/hello", (req, res) => {
  res.json({ msg: "Hello" });
});

// GET /api/v1/contests
router.get(
  "/contests",
  contestController.getAllContests.validator,
  contestController.getAllContests,
);

// POST /api/v1/contests
router.post(
  "/contests",
  // add admin account check here
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
  contestController.updateContest.validator,
  contestController.updateContest,
);

// POST /api/v1/contests/{contest_name}/delete
router.post(
  "/contests/:contest_name/delete",
  contestController.deleteContest.validator,
  contestController.deleteContest,
);

router.use((error, req, res, next) => {
  console.error(error);
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
