const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../../util/multer");

const upload = multer({
  storage,
});

const CountryController = require("./country.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", CountryController.index);
router.post("/", upload.single("image"), CountryController.store);
router.patch("/:country_id", upload.single("image"), CountryController.update);
router.delete("/:country_id", CountryController.destroy);
router.delete("/delete/:country_id", CountryController.destroyAll);

module.exports = router;
