const express = require("express");
const defaultController = require("../controller/index");

const router = express.Router();

//  @METHOD   GET
//  @PATH     /hi
//  @DESC     Get all current users
router.get("/hi", defaultController.getHiThere);

//  @METHOD   GET
//  @PATH     /*
//  @DESC     Get all current users
router.get("*", defaultController.getHelloWorld);

module.exports = router;
