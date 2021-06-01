const express = require("express");
const router = express.Router();

const HistoryController = require("./history.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/getrecharge", HistoryController.getRecharge);
router.get("/coinincome", HistoryController.getCoinIncome);
router.get("/coinoutcome", HistoryController.getCoinOutCome);
router.get("/admin/history", HistoryController.purchaseCoinHistory);
router.post("/", HistoryController.coinTransaction);
router.post("/purchasecoin", HistoryController.purchaseCoinTransaction);

module.exports = router;
