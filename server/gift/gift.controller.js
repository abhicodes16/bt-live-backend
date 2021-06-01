const Gift = require("./gift.model");
const fs = require("fs");
const { deleteVideo, deleteFile } = require("../../util/deleteFile");

exports.index = async (req, res) => {
  try {
    const gift = await Gift.find().populate("category").sort({ createdAt: -1 });

    if (!gift) {
      return res.status(200).json({ status: false, message: "gift not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "success", data: gift });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.show = async (req, res) => {
  try {
    const gift = await Gift.find().sort({ createdAt: -1 });

    if (!gift) {
      return res.status(200).json({ status: false, message: "Gift not found" });
    }

    const data = gift.map((data) => ({
      gift: data.icon,
    }));

    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.categoryWiseGift = async (req, res) => {
  try {
    const gift = await Gift.find({ category: req.query.category }).sort({
      createdAt: -1,
    });
    if (!gift) {
      return res.status(200).json({ status: false, message: "gift not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Success", data: gift });
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
        .json({ status: false, message: "invalid details" });
    if (!req.body.coin)
      return res
        .status(200)
        .json({ status: false, message: "coin is required!" });
    if (!req.body.category)
      return res
        .status(200)
        .json({ status: false, message: "category is required!" });

    if (!req.files)
      return res
        .status(200)
        .json({ status: false, message: "please select an image." });

    const Gifts = req.files.map((gift) => ({
      icon: gift.path,
      coin: req.body.coin,
      category: req.body.category,
    }));

    const gift = await Gift.insertMany(Gifts);

    let data = [];

    for (let i = 0; i < gift.length; i++) {
      data.push(await Gift.findById(gift[i]._id).populate("category"));
    }

    return res
      .status(200)
      .json({ status: true, message: "success", data: data });
  } catch (error) {
    console.log(error);
    deleteVideo(req.files);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "invalid details" });
    if (!req.body.coin)
      return res
        .status(200)
        .json({ status: false, message: "coin is required!" });
    if (!req.body.category)
      return res
        .status(200)
        .json({ status: false, message: "category is required!" });

    const gift = await Gift.findById(req.params.gift_id);

    if (!gift) {
      return res.status(200).json({ status: false, message: "gift not found" });
    }

    if (req.file) {
      if (fs.existsSync(gift.icon)) {
        fs.unlinkSync(gift.icon);
      }
      gift.icon = req.file.path;
    }

    gift.coin = req.body.coin;
    gift.category = req.body.category;

    await gift.save();

    const data = await Gift.findById(gift._id).populate("category");

    return res
      .status(200)
      .json({ status: true, message: "update", data: data });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.destroy = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.gift_id);

    if (!gift) {
      return res.status(200).json({ status: false, message: "gift not found" });
    }

    if (fs.existsSync(gift.icon)) {
      fs.unlinkSync(gift.icon);
    }
    await gift.deleteOne();

    return res
      .status(200)
      .json({ status: true, message: "delete", result: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.destroyAll = async (req, res) => {
  try {
    const deleteIds = req.params.gift_id.trim().split(",");

    const gift = await Gift.find();

    deleteIds.map((id) => {
      gift.map(async (gift) => {
        if (gift._id == id) {
          if (fs.existsSync(gift.icon)) {
            return fs.unlinkSync(gift.icon);
          }
          await gift.deleteOne();
        }
      });
    });

    return res
      .status(200)
      .json({ status: true, message: "delete", result: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
