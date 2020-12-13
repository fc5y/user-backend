require("dotenv").config();

const express = require("express");
const defaultController = require("../controller/index");
const userController = require("../controller/user");
const authController = require("../controller/auth");
const cors = require("cors");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNotUser = require("../middlewares/isNotUser");
const { FcError, SYSTEM_ERROR } = require("../utils/error");
const { statusCode } = require("../utils");

const router = express.Router();

//  @METHOD   GET
//  @PATH     /hi
router.get("/hi", defaultController.getHiThere);

//  @METHOD   GET
//  @PATH     /*
// router.get("*", defaultController.getHelloWorld);

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
  makeHandlerAwareOfAsyncErrors(userController.getById),
);
router.get(
  "/api/v1/users/:username",
  makeHandlerAwareOfAsyncErrors(isLoggedIn),
  makeHandlerAwareOfAsyncErrors(userController.getByUsername),
);
router.get(
  "/api/v1/users",
  makeHandlerAwareOfAsyncErrors(isLoggedIn),
  makeHandlerAwareOfAsyncErrors(userController.getAll),
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

router.delete(
  "/api/v1/users/:id",
  makeHandlerAwareOfAsyncErrors(isLoggedIn),
  makeHandlerAwareOfAsyncErrors(userController.remove),
);

router.get(
  "/api/v1/verify/:id",
  makeHandlerAwareOfAsyncErrors(userController.createVerifyToken),
);

router.post(
  "/api/v1/verify/:id",
  makeHandlerAwareOfAsyncErrors(userController.verifyAccount),
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

module.exports = router;
