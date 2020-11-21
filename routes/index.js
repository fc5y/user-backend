const express = require("express");
const userController = require("../controller/user");

const router = express.Router();

//  @METHOD   GET
//  @PATH     /users
// router.get("/users", userController.getUsers);

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

router.get("/api/users", makeHandlerAwareOfAsyncErrors(userController.getAll));
router.get(
  "/api/users/:id",
  makeHandlerAwareOfAsyncErrors(userController.getById)
);
router.post("/api/users", makeHandlerAwareOfAsyncErrors(userController.create));
router.put(
  "/api/users/:id",
  makeHandlerAwareOfAsyncErrors(userController.update)
);
router.delete(
  "/api/users/:id",
  makeHandlerAwareOfAsyncErrors(userController.remove)
);

module.exports = router;
