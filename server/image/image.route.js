const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../../util/multer");

const ImageController = require("./image.controller");

const upload = multer({
  storage,
});
var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", ImageController.index);

router.post("/", upload.any(), ImageController.store);
router.patch("/:image_id", upload.single("image"), ImageController.update);

// router.delete("/delete/:image_id", ImageController.destroyAll);

router.delete("/:image_id", ImageController.destroy);

module.exports = router;
