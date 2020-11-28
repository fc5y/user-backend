const express = require("express");
const defaultController = require("../controller/index");
const userController = require("../controller/user");
const authController = require("../controller/auth");
const isLoggedIn = require("../middlewares/isLoggedIn");
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
  makeHandlerAwareOfAsyncErrors(isLoggedIn),
  makeHandlerAwareOfAsyncErrors(userController.getAll)
);
router.get(
  "/api/v1/users/:id",
  makeHandlerAwareOfAsyncErrors(isLoggedIn),
  makeHandlerAwareOfAsyncErrors(userController.getById)
);
router.post(
  "/api/v1/users",
  makeHandlerAwareOfAsyncErrors(userController.create)
);
router.put(
  "/api/v1/users/:id",
  makeHandlerAwareOfAsyncErrors(isLoggedIn),
  makeHandlerAwareOfAsyncErrors(userController.update)
);
router.delete(
  "/api/v1/users/:id",
  makeHandlerAwareOfAsyncErrors(isLoggedIn),
  makeHandlerAwareOfAsyncErrors(userController.remove)
);

// Auth
router.post(
  "/api/v1/login",
  makeHandlerAwareOfAsyncErrors(authController.login)
);

module.exports = router;
