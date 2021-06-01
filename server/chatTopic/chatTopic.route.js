const express = require("express");
const router = express.Router();

const ChatTopicController = require("./chatTopic.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", ChatTopicController.chatUserList);

router.post("/add", ChatTopicController.store);

router.post("/search", ChatTopicController.search);

module.exports = router;
