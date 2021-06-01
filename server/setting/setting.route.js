const express = require("express");
const router = express.Router();

const SettingController = require("./setting.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", SettingController.index);
router.post("/", SettingController.store);
router.patch("/:setting_id", SettingController.update);

module.exports = router;
