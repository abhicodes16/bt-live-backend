const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../../util/multer");

const FeedbackController = require("./feedback.controller");

const upload = multer({storage: storage});

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", FeedbackController.index);

router.post("/", upload.single("icon"), FeedbackController.store);

router.delete("/:feedback_id", FeedbackController.destroy);

router.delete("/delete/:feedback_id", FeedbackController.destroyAll);


module.exports = router;
