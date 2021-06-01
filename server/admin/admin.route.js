const express = require("express");
const router = express.Router();

const AdminController = require("./admin.controller");
const multer = require("multer");
const storage = require("../../util/multer");

const AuthMiddleware = require("../middleware/AdminMiddleware");

const upload = multer({
  storage,
});

// var checkAccessWithSecretKey = require("../../checkAccess");

// router.use(checkAccessWithSecretKey());

// router.post("/", AdminController.store);

router.get("/", AuthMiddleware, AdminController.getprofile);
router.get("/api/gets", AdminController.getAdmins);
router.post("/get/admin", AdminController.getAdmin);
router.post("/", AdminController.login);

router.patch("/", AuthMiddleware, AdminController.update);
router.patch(
  "/updateImage",
  AuthMiddleware,
  upload.single("image"),
  AdminController.updateImage
);

router.put("/", AuthMiddleware, AdminController.changePass);

router.post("/forgotpass/:admin_id", AdminController.forgotPass);

router.post("/sendemail", AdminController.sendEmail);

module.exports = router;
