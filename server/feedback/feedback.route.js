const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../../util/multer");

const FeedbackController = require("./feedback.controller");

const upload = multer({storage});

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", FeedbackController.index);

router.post("/", upload.single("icon"), FeedbackController.store);

module.exports = router;
