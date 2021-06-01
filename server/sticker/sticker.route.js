const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

const StickerController = require("./sticker.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", StickerController.index);
router.post("/", upload.any(), StickerController.store);
router.patch(
  "/:sticker_id",
  upload.single("sticker"),
  StickerController.update
);
router.delete("/:sticker_id", StickerController.delete);
router.delete("/delete/:sticker_id", StickerController.destroyAll);

module.exports = router;
