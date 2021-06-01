const express = require("express");
const router = express.Router();

const DashboardController = require("./dashboard.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.get(checkAccessWithSecretKey());

router.get("/", DashboardController.index);

module.exports = router;
