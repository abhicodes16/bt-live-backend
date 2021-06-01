const express = require("express");
const router = express.Router();

const FavouriteController = require("./favourite.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.get(checkAccessWithSecretKey());

router.get("/favouritelist", FavouriteController.favourite);

module.exports = router;
