const express = require("express");
const router = express.Router();

const NotificationController = require("./notification.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

const multer = require("multer");

const storage = require("../../util/multer");

const upload = multer({
  storage,
});

router.get(checkAccessWithSecretKey());
router.get("/getnotification", NotificationController.getNotification);
router.post(
  "/notification/send",
  upload.single("image"),
  NotificationController.sendNotification
);

module.exports = router;
