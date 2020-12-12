const express = require("express");
const router = express.Router();

// GET /api/v1/hello
router.get("/hello", (req, res) => {
  res.json({ msg: "Hello" });
});

module.exports = router;
