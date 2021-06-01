const express = require("express");
const router = express.Router();

const ChatController = require("./chat.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.get(checkAccessWithSecretKey());

router.post("/add", ChatController.store);
router.post("/oldchat", ChatController.getOldChat);

module.exports = router;
