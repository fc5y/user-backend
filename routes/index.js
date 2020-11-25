const express = require("express");
const defaultController = require("../controller/index");
const userController = require("../controller/user");
const authController = require("../controller/auth");
const isLogined = require("../middlewares/isLogined");
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
      next(error);
    }
  };
}

// User

router.get(
  "/api/v1/users",
  makeHandlerAwareOfAsyncErrors(isLogined),
  makeHandlerAwareOfAsyncErrors(userController.getAll)
);
router.get(
  "/api/v1/users/:id",
  makeHandlerAwareOfAsyncErrors(isLogined),
  makeHandlerAwareOfAsyncErrors(userController.getById)
);
router.post(
  "/api/v1/users",
  makeHandlerAwareOfAsyncErrors(userController.create)
);
router.put(
  "/api/v1/users/:id",
  makeHandlerAwareOfAsyncErrors(isLogined),
  makeHandlerAwareOfAsyncErrors(userController.update)
);
router.delete(
  "/api/v1/users/:id",
  makeHandlerAwareOfAsyncErrors(isLogined),
  makeHandlerAwareOfAsyncErrors(userController.remove)
);

// Auth
router.post(
  "/api/v1/login",
  makeHandlerAwareOfAsyncErrors(authController.login)
);

module.exports = router;
