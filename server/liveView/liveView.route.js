const express = require("express");
const router = express.Router();

const LiveViewController = require("./liveView.controller");
var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", LiveViewController.userDetail);

// router.post("/", LiveViewController.store);

router.post("/", LiveViewController.delete);

module.exports = router;
