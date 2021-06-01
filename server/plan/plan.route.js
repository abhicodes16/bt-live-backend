const express = require("express");
const router = express.Router();

const PlanController = require("./plan.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", PlanController.index);

router.post("/", PlanController.store);

router.patch("/:plan_id", PlanController.update);

router.delete("/:plan_id", PlanController.destroy);

module.exports = router;
