const express = require("express");
const router = express.Router();

const authController = require("../controller/auth");
const { FcError, SYSTEM_ERROR } = require("../utils/error");
const { statusCode } = require("../utils");
const isNotUser = require("../middlewares/isNotUser");

// GET /api/v1/hello
router.get("/hello", (req, res) => {
  res.json({ msg: "Hello" });
});

function makeHandlerAwareOfAsyncErrors(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res, next);
    } catch (error) {
      if (error instanceof FcError) {
        res.status(statusCode.BAD_REQUEST).send({
          code: error.code,
          msg: error.msg,
          data: error.data || {},
        });
      } else {
        const fcError = new FcError(SYSTEM_ERROR);
        res.status(statusCode.BAD_REQUEST).send({
          code: fcError.code,
          msg: error.msg,
          data: fcError.data || {},
        });
      }
    }
  };
}

// Auth
router.post(
  "/login",
  makeHandlerAwareOfAsyncErrors(authController.login),
);
router.post(
  "/send-otp",
  makeHandlerAwareOfAsyncErrors(authController.sendOtp),
);
router.post(
  "/signup",
  makeHandlerAwareOfAsyncErrors(isNotUser),
  makeHandlerAwareOfAsyncErrors(authController.signup),
);

module.exports = router;
