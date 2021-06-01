const express = require("express");
const router = express.Router();

const RandomController = require("./random.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.get(checkAccessWithSecretKey());

router.get("/thumblist", RandomController.randomImgName);
router.get("/hostisvalid", RandomController.isValidHost);

module.exports = router;
