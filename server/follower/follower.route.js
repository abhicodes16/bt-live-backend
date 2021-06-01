const express = require("express");
const router = express.Router();

const FollowerController = require("./follower.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.get(checkAccessWithSecretKey());

router.post("/followinglist", FollowerController.followingList);
router.post("/followerlist", FollowerController.followerList);
router.post("/follow", FollowerController.follow);
router.post("/unfollow", FollowerController.unFollow);
router.post("/checkfollow", FollowerController.checkIsFollow);

module.exports = router;
