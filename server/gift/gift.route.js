const express = require("express");
const router = express.Router();

const GiftController = require("./gift.controller");

const multer = require("multer");
const storage = require("../../util/multer");

const upload = multer({
  storage,
});

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/show", GiftController.show);
router.get("/", GiftController.index);

router.get("/category", GiftController.categoryWiseGift);

router.post("/", upload.any(), GiftController.store);

router.patch("/:gift_id", upload.single("icon"), GiftController.update);

router.delete("/:gift_id", GiftController.destroy);
router.delete("/delete/:gift_id", GiftController.destroyAll);

module.exports = router;
