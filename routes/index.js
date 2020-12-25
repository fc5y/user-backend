require("dotenv").config();

const express = require("express");
const defaultController = require("../controller/index");
const userController = require("../controller/user");
const authController = require("../controller/auth");
const participationController = require("../controller/participation");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNotUser = require("../middlewares/isNotUser");
const { FcError, SYSTEM_ERROR } = require("../utils/error");
const { statusCode } = require("../utils");

const router = express.Router();

// We create a wrapper to workaround async errors not being transmitted correctly.
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

// User
router.get(
  "/api/v1/me",
  makeHandlerAwareOfAsyncErrors(isLoggedIn),
  makeHandlerAwareOfAsyncErrors(userController.getUserById),
);
router.get(
  "/api/v1/users/:username",
  makeHandlerAwareOfAsyncErrors(userController.getUserByUsername),
);
router.post(
  "/api/v1/me",
  makeHandlerAwareOfAsyncErrors(isLoggedIn),
  makeHandlerAwareOfAsyncErrors(userController.update),
);

router.post(
  "/api/v1/me/change-password",
  makeHandlerAwareOfAsyncErrors(isLoggedIn),
  makeHandlerAwareOfAsyncErrors(userController.changePassword)
);

// Auth
router.post(
  "/api/v1/login",
  makeHandlerAwareOfAsyncErrors(authController.login),
);
router.post(
  "/api/v1/send-otp",
  makeHandlerAwareOfAsyncErrors(authController.sendOtp),
);
router.post(
  "/api/v1/signup",
  makeHandlerAwareOfAsyncErrors(isNotUser),
  makeHandlerAwareOfAsyncErrors(authController.signup),
);

// // POST /api/v1/participation
// // Register a contest
// router.post(
//   "/api/v1/participations",
//   makeHandlerAwareOfAsyncErrors(isLoggedIn),
//   makeHandlerAwareOfAsyncErrors(participationController.register),
// );

// GET /api/v1/participation/{username}
// Get participations by username
router.get(
  "/api/v1/participations/:username",
  makeHandlerAwareOfAsyncErrors(participationController.getParticipationByUsername),
);

// GET api/v1/contests/{contest_name}/cred
// Get contest credentials
router.get(
  "/api/v1/participations/:contest_name/cred",
  makeHandlerAwareOfAsyncErrors(isLoggedIn),
  makeHandlerAwareOfAsyncErrors(participationController.getCredential),
);
module.exports = router;
