const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../../util/multer");

const upload = multer({
  storage,
});

const UserController = require("./user.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());
router.get("/profile", UserController.getProfile);
router.get("/globalsearch", UserController.search);
router.get("/", UserController.index);
router.get("/:user_id", UserController.blockUnblockUser);
router.post("/check_username", UserController.checkUsername);
router.post("/signup", UserController.store);
router.post("/edit_profile", upload.single("image"), UserController.update);
router.post("/liveuser", UserController.liveUser);
router.post("/destroyliveuser", UserController.destroyLiveUser);
router.post("/less", UserController.lessCoin);
router.post("/add", UserController.addCoin);
router.post("/dailytask", UserController.dailyTask);
router.post("/checkdailytask", UserController.checkDailyTask);
router.delete("/logout", UserController.logout);

module.exports = router;
