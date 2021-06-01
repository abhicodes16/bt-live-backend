const History = require("./history.model");
const User = require("../user/user.model");
const Plan = require("../plan/plan.model");
const Notification = require("../notification/notification.model");
const dayjs = require("dayjs");

//store history when open video, send gift
exports.coinTransaction = async (req, res) => {
  try {
    const fromUserExist = await User.findById(req.body.from_user_id);

    if (!fromUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "from user id is not exist" });
    }

    const toUserExist = await User.findById(req.body.to_user_id);

    if (!toUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "to user id is not exist" });
    }

    if (!req.body || !req.body.coin) {
      return res
        .status(200)
        .json({ status: false, message: "coin is required" });
    }

    if (req.body.from_user_id === req.body.to_user_id) {
      if (toUserExist) {
        if (toUserExist.coin <= 0 || toUserExist.coin < req.body.coin) {
          return res
            .status(200)
            .json({ status: false, message: "You have not enough coin!" });
        }

        toUserExist.coin = toUserExist.coin - parseInt(req.body.coin);

        toUserExist.save();
      }
    } else {
      if (fromUserExist) {
        if (fromUserExist.coin <= 0 || fromUserExist.coin < req.body.coin) {
          return res
            .status(200)
            .json({ status: false, message: "You have not enough coin!" });
        }

        fromUserExist.coin = fromUserExist.coin - parseInt(req.body.coin);

        fromUserExist.save();
      }

      if (toUserExist) {
        toUserExist.coin = toUserExist.coin + parseInt(req.body.coin);
        toUserExist.save();
      }
    }

    const history = new History();

    history.from_user_id = req.body.from_user_id;
    history.to_user_id = req.body.to_user_id;
    history.coin = req.body.coin;

    await history.save();

    return res
      .status(200)
      .json({ status: true, message: "success", user: fromUserExist });
  } catch (error) {
    console.log(error);
  }
};

//store history when purchase coin
exports.purchaseCoinTransaction = async (req, res) => {
  try {
    const fromUserExist = await User.findById(req.body.from_user_id);

    if (!fromUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "from user id is not exist" });
    }

    const PlanExist = await Plan.findById(req.body.plan_id);
    if (!PlanExist) {
      return res
        .status(200)
        .json({ status: false, message: "Plan is not exist" });
    }

    if (fromUserExist && PlanExist) {
      fromUserExist.coin = fromUserExist.coin + parseInt(PlanExist.coin);
      fromUserExist.save();
    }

    const history = new History();

    history.from_user_id = req.body.from_user_id;
    history.coin = PlanExist.coin;
    history.rupee = PlanExist.rupee;
    history.plan_id = req.body.plan_id;

    await history.save();

    const notification = new Notification();

    notification.title = "Coin Purchased";
    notification.description = `You have purchased ${PlanExist.coin} coin amount of ${PlanExist.rupee}.`;
    notification.type = "purchase";
    notification.image = null;
    notification.user_id = req.body.from_user_id;

    await notification.save();

    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    console.log(error);
  }
};

exports.getRecharge = async (req, res) => {
  try {
    if (!req.query.user_id) {
      return res
        .status(200)
        .json({ status: false, message: "user id is required" });
    }
    const fromUserExist = await History.find({
      plan_id: { $exists: true, $ne: null },
    })
      .where({ from_user_id: req.query.user_id })
      .sort({ createdAt: -1 });

    if (!fromUserExist) {
      return res.status(200).json({ status: false, message: "no data found" });
    }

    const recharge = await fromUserExist.map((data) => ({
      coin: data.coin,
      rupee: data.rupee,
      date: data.createdAt.toISOString().slice(0, 10),
    }));

    return res
      .status(200)
      .json({ status: true, message: "success", data: recharge });
  } catch (error) {
    console.log(error);
  }
};

exports.getCoinIncome = async (req, res) => {
  try {
    if (!req.query.user_id) {
      return res
        .status(200)
        .json({ status: false, message: "user id is required" });
    }
    const fromUserExist = await History.find({
      to_user_id: req.query.user_id,
    })
      .populate("from_user_id", "username")
      .sort({ createdAt: -1 });

    if (!fromUserExist) {
      return res.status(200).json({ status: false, message: "no data found" });
    }

    const recharge = await fromUserExist.map((data) => ({
      coin: data.coin,
      person: data.from_user_id.username,
      date: data.createdAt.toISOString().slice(0, 10),
    }));

    return res
      .status(200)
      .json({ status: true, message: "success", data: recharge });
  } catch (error) {
    console.log(error);
  }
};

exports.getCoinOutCome = async (req, res) => {
  try {
    if (!req.query.user_id) {
      return res
        .status(200)
        .json({ status: false, message: "user id is required" });
    }
    const fromUserExist = await History.find({
      from_user_id: req.query.user_id,
    })
      .where({ plan_id: null })
      .populate("to_user_id", "username")
      .sort({ createdAt: -1 });

    if (!fromUserExist) {
      return res.status(200).json({ status: false, message: "no data found" });
    }

    const recharge = await fromUserExist.map((data) => ({
      coin: data.coin,
      person: data.to_user_id.username,
      date: data.createdAt.toISOString().slice(0, 10),
    }));

    return res
      .status(200)
      .json({ status: true, message: "success", data: recharge });
  } catch (error) {
    console.log(error);
  }
};

//for admin
exports.purchaseCoinHistory = async (req, res) => {
  try {
    const history = await History.find({
      plan_id: { $exists: true, $ne: null },
    })
      .populate("from_user_id", "username")
      .sort({ createdAt: -1 });

    const data = await history.map((data) => ({
      who: data.from_user_id.username,
      rupee: data.rupee,
      coin: data.coin,
      date: data.createdAt,
      plan_id: data.plan_id,
    }));

    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    console.log(error);
  }
};
