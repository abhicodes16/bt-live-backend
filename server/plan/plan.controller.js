const Plan = require("./plan.model");

exports.index = async (req, res) => {
  try {
    const plan = await Plan.find().sort({ createdAt: -1 });

    if (!plan) {
      return res.status(200).json({ status: false, message: "Plan not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Success", data: plan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.store = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });
    if (!req.body.coin)
      return res
        .status(200)
        .json({ status: false, message: "coin is required" });
    if (!req.body.rupee)
      return res
        .status(200)
        .json({ status: false, message: "rupee is required" });
    // if (!req.body.currency)
    //   return res
    //     .status(200)
    //     .json({ status: false, message: "currency is required" });
    if (!req.body.googleProductId)
      return res
        .status(200)
        .json({ status: false, message: "google product id is required" });

    const plan = new Plan();

    plan.coin = req.body.coin;
    plan.rupee = req.body.rupee;
    // plan.currency = req.body.currency;
    plan.googleProductId = req.body.googleProductId;

    await plan.save();

    if (!plan) {
      throw new Error();
    }

    return res
      .status(200)
      .json({ status: true, message: "Success", data: plan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });
    if (!req.body.coin)
      return res
        .status(200)
        .json({ status: false, message: "coin is required" });
    if (!req.body.rupee)
      return res
        .status(200)
        .json({ status: false, message: "rupee is required" });
    // if (!req.body.currency)
    //   return res
    //     .status(200)
    //     .json({ status: false, message: "currency is required" });
    if (!req.body.googleProductId)
      return res
        .status(200)
        .json({ status: false, message: "google product id is required" });

    const plan = await Plan.findById(req.params.plan_id);

    if (!plan) {
      return res.status(200).json({ status: false, message: "Plan not found" });
    }

    plan.coin = req.body.coin;
    plan.rupee = req.body.rupee;
    // plan.currency = req.body.currency;
    plan.googleProductId = req.body.googleProductId;
    await plan.save();

    return res
      .status(200)
      .json({ status: true, message: "success", data: plan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.plan_id);
    if (!plan) {
      return res.status(200).json({ status: false, message: "Plan not found" });
    }

    await plan.deleteOne();

    return res
      .status(200)
      .json({ status: true, message: "success", result: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
