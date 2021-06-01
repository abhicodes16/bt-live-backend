const Redeem = require("./redeem.model");
const User = require("../user/user.model");

//FCM
var FCM = require("fcm-node");
var { serverKey } = require("../../util/serverPath");
var fcm = new FCM(serverKey);

exports.index = async (req, res) => {
  try {
    const redeem = await Redeem.find()
      .where({ accepted: false })
      .sort({ createdAt: -1 })
      .populate("user_id");

    if (!redeem) {
      throw new Error();
    }

    return res
      .status(200)
      .json({ status: true, message: "success", data: redeem });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
exports.show = async (req, res) => {
  try {
    const redeem = await Redeem.find()
      .where({ accepted: true })
      .sort({ createdAt: -1 })
      .populate("user_id");

    if (!redeem) {
      throw new Error();
    }

    return res
      .status(200)
      .json({ status: true, message: "success", data: redeem });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.store = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details." });
    if (!req.body.user_id)
      return res
        .status(200)
        .json({ status: false, message: "user id is required" });
    if (!req.body.paymentGateway)
      return res
        .status(200)
        .json({ status: false, message: "payment gateway required" });
    if (!req.body.description)
      return res
        .status(200)
        .json({ status: false, message: "description required" });
    if (!req.body.coin)
      return res
        .status(200)
        .json({ status: false, message: "coin is required" });

    const user = await User.findById(req.body.user_id);

    if (!user) {
      return res.status(200).json({ status: false, message: "user not found" });
    }

    const redeem = new Redeem();

    redeem.user_id = req.body.user_id;
    redeem.description = req.body.description;
    redeem.coin = req.body.coin;
    redeem.paymentGateway = req.body.paymentGateway;

    await redeem.save();

    if (!redeem) {
      throw new Error();
    }

    user.coin = 0;
    await user.save();

    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const redeem = await Redeem.findById(req.params.redeem_id).populate(
      "user_id"
    );

    if (!redeem) {
      throw new Error();
    }

    redeem.accepted = !redeem.accepted;

    await redeem.save();

    if (redeem.user_id.isLogout === false && redeem.user_id.block === false) {
      const payload = {
        to: redeem.user_id.fcm_token,
        notification: {
          body: "Your Redeem Request has been Accepted!",
        },
      };

      await fcm.send(payload, function (err, response) {
        if (err) {
          console.log("Something has gone wrong!");
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });
    }

    return res
      .status(200)
      .json({ status: true, message: "success", data: redeem });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
