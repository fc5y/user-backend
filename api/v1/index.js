const express = require("express");

const { ERRORS } = require("./constants");
const { LogicError } = require("./utils/errors");
const contestController = require("./controllers/contests");
const contestValidator = require("./validators/contests");
const authController = require("./controllers/auth");
const authValidator = require("./validators/auth");
const participationController = require("./controllers/participations");
const participationValidator = require("./validators/participations");
const { requireAdminRole, requireLogin } = require("./validators/common");

const router = express.Router();

// -------- Authentication -------------------------------------------

// POST /api/v1/login
router.post("/login", authValidator.login, authController.login);
router.post("/send-otp", authValidator.sendOtp, authController.sendOtp);
router.post("/signup", authValidator.signup, authController.signup);

// -------- Contests -------------------------------------------------

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

// -------- Participations -------------------------------------------
// POST /api/v1/participations
// Register a contest
router.post(
  "/participations",
  requireLogin,
  participationValidator.register,
  participationController.register,
);

// GET /api/v1/participations/{username}
// Get participations by username
router.get(
  "/participations/:username",
  requireLogin,
  participationValidator.getAllByUsername,
  participationController.getAllByUsername,
);

// GET api/v1/participations/{contest_name}/cred
// Get contest credentials
router.get(
  "/participations/:contest_name/cred",
  requireLogin,
  participationValidator.getCredential,
  participationController.getCredential,
);

router.use((error, req, res, _next) => {
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
