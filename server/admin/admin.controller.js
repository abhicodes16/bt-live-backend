const Admin = require("./admin.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { deleteFile } = require("../../util/deleteFile");
const fs = require("fs");
const nodemailer = require("nodemailer");

const { serverPath } = require("../../util/serverPath");

exports.getprofile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "admin not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "success", data: admin });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.store = async (req, res) => {
  try {
    const admin = await Admin.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    return res
      .status(200)
      .json({ status: true, message: "success", data: admin });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admin = await Admin.find({ flag: true });
    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "admin not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "success", data: admin });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return res.status(422).json({ error: [{ email: "Email Not Found" }] });
    }

    const isEqual = await bcrypt.compare(req.body.password, admin.password);
    if (!isEqual) {
      return res
        .status(422)
        .json({ error: [{ password: "Password does not match!" }] });
    }

    return res
      .status(200)
      .json({ status: true, message: "success", data: admin });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });

    if (!req.body.name)
      return res
        .status(200)
        .json({ status: false, message: "name is required" });

    if (!req.body.email)
      return res
        .status(200)
        .json({ status: false, message: "email is required" });

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }

    // if (req.file) {
    //   if (fs.existsSync(admin.image)) {
    //     fs.unlinkSync(admin.image);
    //   }
    //   admin.image = req.file.path;
    // }

    admin.name = req.body.name;
    admin.email = req.body.email;

    await admin.save();

    return res
      .status(200)
      .json({ status: true, message: "Update", data: admin });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.updateImage = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }

    if (req.file) {
      if (fs.existsSync(admin.image)) {
        fs.unlinkSync(admin.image);
      }
      admin.image = req.file.path;
    }

    await admin.save();

    return res
      .status(200)
      .json({ status: true, message: "Update", data: admin });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details." });
    if (!req.body.email)
      return res
        .status(200)
        .json({ status: false, message: "Email is required" });
    if (!req.body.password)
      return res
        .status(200)
        .json({ status: false, message: "Password is required" });

    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      const err = new Error();
      err.status = 422;
      err.errors = [{ email: "Email does not Exist!" }];
      throw err;
    }

    const isEqual = await bcrypt.compare(req.body.password, admin.password);
    if (!isEqual) {
      const err = new Error();
      err.status = 422;
      err.errors = [{ password: "Password does not match!" }];
      throw err;
    }

    const payload = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
      flag: admin.flag,
    };

    const token = jwt.sign(payload, "jsonWebToken");

    if (req.body.key !== null && req.body.package_ !== null) {
      admin.key = req.body.key;
      admin.package = req.body.package_;

      await admin.save();
    }

    return res.status(200).json({ status: true, message: "success", token });
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).json({
      status: false,
      error: error.errors || error.message || "server error",
    });
  }
};

exports.changePass = async (req, res, next) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });

    if (!req.body.oldPass)
      return res
        .status(200)
        .json({ status: false, message: "old password is required" });
    if (!req.body.password)
      return res
        .status(200)
        .json({ status: false, message: "new password is required" });

    if (!req.body.confirmPass)
      return res
        .status(200)
        .json({ status: false, message: "confirm password is required" });

    if (req.body.password !== req.body.confirmPass)
      return res.status(200).json({
        status: false,
        message: "Password Confirmation does not match password..",
      });

    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(200).json({
        status: false,
        message: "admin not found",
      });
    }

    const isEqual = await bcrypt.compare(req.body.oldPass, admin.password);
    if (!isEqual) {
      const err = new Error("Old Password does not Match!");
      err.status = 422;
      throw err;
    }

    admin.password = bcrypt.hashSync(req.body.password, 10);

    await admin.save();

    return res
      .status(200)
      .json({ status: true, message: "Success", result: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.forgotPass = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });

    if (!req.body.new_pass)
      return res
        .status(200)
        .json({ status: false, message: "new password is required" });

    if (!req.body.confirm_pass)
      return res
        .status(200)
        .json({ status: false, message: "confirm password is required" });

    if (req.body.new_pass !== req.body.confirm_pass)
      return res.status(200).json({
        status: false,
        message: "Password Confirmation does not match password..",
      });

    const admin = await Admin.findById(req.params.admin_id);

    if (!admin) {
      return res.status(200).json({
        status: false,
        message: "admin not found",
      });
    }

    admin.password = bcrypt.hashSync(req.body.new_pass, 10);
    await admin.save();

    return res
      .status(200)
      .json({ status: true, message: "password changed", result: true });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.sendEmail = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      const err = new Error("Email does not Exist!");
      err.status = 200;
      throw err;
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "YOUR EMAIL ID",
        pass: "YOUR EMAIL PASSWORD",
      },
    });

    var tab = "";
    tab += "<!DOCTYPE html><html><head>";
    tab +=
      "<meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'><meta name='viewport' content='width=device-width, initial-scale=1'>";
    tab += "<style type='text/css'>";
    tab +=
      " @media screen {@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 400;}";
    tab +=
      "@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 700;}}";
    tab +=
      "body,table,td,a {-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }";
    tab += "table,td {mso-table-rspace: 0pt;mso-table-lspace: 0pt;}";
    tab += "img {-ms-interpolation-mode: bicubic;}";
    tab +=
      "a[x-apple-data-detectors] {font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height:inherit !important;color: inherit !important;text-decoration: none !important;}";
    tab += "div[style*='margin: 16px 0;'] {margin: 0 !important;}";
    tab +=
      "body {width: 100% !important;height: 100% !important;padding: 0 !important;margin: 0 !important;}";
    tab += "table {border-collapse: collapse !important;}";
    tab += "a {color: #1a82e2;}";
    tab +=
      "img {height: auto;line-height: 100%;text-decoration: none;border: 0;outline: none;}";
    tab += "</style></head><body>";
    tab += "<table border='0' cellpadding='0' cellspacing='0' width='100%'>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>";
    tab +=
      "<tr><td align='center' valign='top' bgcolor='#ffffff' style='padding:36px 24px 0;border-top: 3px solid #d4dadf;'><a href='#' target='_blank' style='display: inline-block;'>";
    tab +=
      "<img src='https://tomotest.codderlab.com/storage/forgot_password.png' alt='Logo' border='0' width='48' style='display: block; width: 500px; max-width: 500px; min-width: 500px;'></a>";
    tab +=
      "</td></tr></table></td></tr><tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff'>";
    tab +=
      "<h1 style='margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;'>SET YOUR PASSWORD</h1></td></tr></table></td></tr>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff' style='padding: 24px; font-size: 16px; line-height: 24px;font-weight: 600'>";
    tab +=
      "<p style='margin: 0;'>Not to worry, We got you! Let's get you a new password.</p></td></tr><tr><td align='left' bgcolor='#ffffff'>";
    tab +=
      "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' bgcolor='#ffffff' style='padding: 12px;'>";
    tab +=
      "<table border='0' cellpadding='0' cellspacing='0'><tr><td align='center' style='border-radius: 4px;padding-bottom: 50px;'>";
    tab +=
      "<a href='" +
      serverPath +
      "change/" +
      admin._id +
      "' target='_blank' style='display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;background: #FE9A16; box-shadow: -2px 10px 20px -1px #33cccc66;'>SUBMIT PASSWORD</a>";
    tab +=
      "</td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>";

    var mailOptions = {
      from: "YOUR EMAIL ID",
      to: req.body.email,
      subject: "Sending Email from Xitij Infotech",
      html: tab,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).json({
          status: true,
          message: "Email send successfully",
          result: true,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
