const Setting = require("./setting.model");

exports.index = async (req, res) => {
  try {
    const setting = await Setting.find().sort({ createdAt: -1 });

    if (!setting) {
      throw new Error();
    }

    return res
      .status(200)
      .json({ status: true, message: "success", data: setting[0] });
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
    if (!req.body.googlePayId)
      return res
        .status(200)
        .json({ status: false, message: "google pay id is required" });
    if (!req.body.agoraId)
      return res
        .status(200)
        .json({ status: false, message: "agora id is required" });
    if (!req.body.policyLink)
      return res
        .status(200)
        .json({ status: false, message: "policy link is required" });
    if (!req.body.hostCharge)
      return res
        .status(200)
        .json({ status: false, message: "host charge is required" });
    if (!req.body.loginBonus)
      return res
        .status(200)
        .json({ status: false, message: "login bonus is required" });

    const setting = new Setting();

    setting.googlePayId = req.body.googlePayId;
    setting.agoraId = req.body.agoraId;
    setting.policyLink = req.body.policyLink;
    setting.hostCharge = req.body.hostCharge;
    setting.loginBonus = req.body.loginBonus;
    // setting.currency = req.body.currency;
    // setting.howManyCoins = req.body.howManyCoins;
    // setting.toCurrency = req.body.toCurrency;

    await setting.save();

    if (!setting) {
      throw new Error();
    }

    return res
      .status(200)
      .json({ status: true, message: "success", data: setting });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.setting_id);

    if (!setting) {
      throw new Error();
    }

    setting.googlePayId = req.body.googlePayId;
    setting.agoraId = req.body.agoraId;
    setting.agoraCertificate = req.body.agoraCertificate;
    setting.policyLink = req.body.policyLink;
    setting.hostCharge = req.body.hostCharge;
    setting.loginBonus = req.body.loginBonus;
    setting.redeemGateway = req.body.redeemGateway;
    setting.currency = req.body.currency;
    setting.howManyCoins = req.body.howManyCoins;
    setting.toCurrency = req.body.toCurrency;
    setting.minPoints = req.body.minPoints;
    setting.streamingMinValue = req.body.streamingMinValue;
    setting.streamingMaxValue = req.body.streamingMaxValue;
    setting.dailyTaskMinValue = req.body.dailyTaskMinValue;
    setting.dailyTaskMaxValue = req.body.dailyTaskMaxValue;

    await setting.save();

    return res
      .status(200)
      .json({ status: true, message: "success", data: setting });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
