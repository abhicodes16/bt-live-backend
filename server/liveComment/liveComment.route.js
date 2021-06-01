const express = require("express");
const router = express.Router();

const LiveCommentController = require("./liveComment.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", LiveCommentController.index);

router.post("/", LiveCommentController.store);

module.exports = router;
