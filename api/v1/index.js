const express = require("express");
const contestController = require("./controllers/contests");

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

module.exports = router;
