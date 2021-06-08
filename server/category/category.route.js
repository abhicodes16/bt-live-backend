const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../../util/multer");

const CategoryController = require("./category.controller");

const upload = multer({
  storage,
});

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", CategoryController.index);

router.post("/", upload.single("icon"), CategoryController.store);

router.patch("/:category_id", upload.single("icon"), CategoryController.update);

router.put("/:category_id", CategoryController.isTopToggle);

router.delete("/:category_id", CategoryController.destroy);

router.delete("/delete/:category_id", CategoryController.destroyAll);

module.exports = router;
