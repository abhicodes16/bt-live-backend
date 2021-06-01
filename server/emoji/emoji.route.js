const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

const EmojiController = require("./emoji.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", EmojiController.index);
router.post("/", upload.any(), EmojiController.store);
router.patch("/:emoji_id", upload.single("emoji"), EmojiController.update);
router.delete("/:emoji_id", EmojiController.delete);
router.delete("/delete/:emoji_id", EmojiController.destroyAll);

module.exports = router;
