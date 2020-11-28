const express = require("express");
const defaultController = require("../controller/index");
const userController = require("../controller/user");
const authController = require("../controller/auth");
const jwt = require("express-jwt");
const { FcError } = require("../error");
require("dotenv").config({ silent: true });

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
      await handler(req, res);
    } catch (error) {

      if (error instanceof FcError) {
        res.status(400).send({
          code: error.code,
          msg: error.msg,
          data: error.data
        });
      } else {
        next(error);
      }
    }
  };
}

// User

router.get(
  "/api/v1/users",
  makeHandlerAwareOfAsyncErrors(userController.getAll)
);
router.get(
  "/api/v1/users/:id",
  makeHandlerAwareOfAsyncErrors(userController.getById)
);
router.post(
  "/api/v1/users",
  makeHandlerAwareOfAsyncErrors(userController.create)
);
router.put(
  "/api/v1/users/:id",
  makeHandlerAwareOfAsyncErrors(userController.update)
);
router.delete(
  "/api/v1/users/:id",
  makeHandlerAwareOfAsyncErrors(userController.remove)
);

// Auth
router.post(
  "/api/v1/login",
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
  }),
  makeHandlerAwareOfAsyncErrors(authController.login)
);

module.exports = router;
