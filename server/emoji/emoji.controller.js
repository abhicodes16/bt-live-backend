const Emoji = require("./emoji.model");
const fs = require("fs");
const { deleteFile, deleteVideo } = require("../../util/deleteFile");

exports.index = async (req, res) => {
  try {
    const emoji = await Emoji.find().sort({ createdAt: -1 });

    if (!emoji) {
      throw new Error();
    }

    return res
      .status(200)
      .json({ status: true, message: "success", data: emoji });
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
    if (!req.files)
      return res
        .status(200)
        .json({ status: false, message: "please select an emoji" });

    const emojis = await req.files.map((data) => ({
      emoji: data.path,
    }));

    const emoji = await Emoji.insertMany(emojis);

    return res
      .status(200)
      .json({ status: true, message: "success", data: emoji });
  } catch (error) {
    console.log(error);
    deleteVideo(req.files);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.update = async (req, res, next) => {
  try {
    const emoji = await Emoji.findById(req.params.emoji_id);

    if (!emoji) {
      throw new Error();
    }

    if (req.file) {
      if (fs.existsSync(emoji.emoji)) {
        fs.unlinkSync(emoji.emoji);
      }
      emoji.emoji = req.file.path;
    }

    await emoji.save();

    return res
      .status(200)
      .json({ status: true, message: "success", data: emoji });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const emoji = await Emoji.findById(req.params.emoji_id);

    if (!emoji) {
      throw new Error();
    }

    if (fs.existsSync(emoji.emoji)) {
      fs.unlinkSync(emoji.emoji);
    }

    await emoji.deleteOne();

    return res
      .status(200)
      .json({ status: true, message: "success", result: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.destroyAll = async (req, res) => {
  try {
    const deleteIds = req.params.emoji_id.trim().split(",");

    const emoji = await Emoji.find();

    deleteIds.map((id) => {
      emoji.map(async (emoji) => {
        if (emoji._id == id) {
          if (fs.existsSync(emoji.emoji)) {
            return fs.unlinkSync(emoji.emoji);
          }
          await emoji.deleteOne();
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
