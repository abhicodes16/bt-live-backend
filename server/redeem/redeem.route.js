const express = require("express");
const router = express.Router();

const RedeemController = require("./redeem.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", RedeemController.index);

//accepted=true
router.get("/show", RedeemController.show);
router.post("/", RedeemController.store);
router.patch("/:redeem_id", RedeemController.update);

module.exports = router;
