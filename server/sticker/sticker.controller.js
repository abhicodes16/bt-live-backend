const Sticker = require("./sticker.model");
const fs = require("fs");
const { deleteFile, deleteVideo } = require("../../util/deleteFile");

exports.index = async (req, res) => {
  try {
    const sticker = await Sticker.find().sort({ createdAt: -1 });

    if (!sticker) {
      throw new Error();
    }

    return res
      .status(200)
      .json({ status: true, message: "success", data: sticker });
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
        .json({ status: false, message: "please select a sticker" });

    const stickers = await req.files.map((data) => ({
      sticker: data.path,
    }));

    const sticker = await Sticker.insertMany(stickers);

    return res
      .status(200)
      .json({ status: true, message: "success", data: sticker });
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
    const sticker = await Sticker.findById(req.params.sticker_id);

    if (!sticker) {
      throw new Error();
    }

    if (req.file) {
      if (fs.existsSync(sticker.sticker)) {
        fs.unlinkSync(sticker.sticker);
      }
      sticker.sticker = req.file.path;
    }

    await sticker.save();

    return res
      .status(200)
      .json({ status: true, message: "success", data: sticker });
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
    const sticker = await Sticker.findById(req.params.sticker_id);

    if (!sticker) {
      throw new Error();
    }

    if (fs.existsSync(sticker.sticker)) {
      fs.unlinkSync(sticker.sticker);
    }

    await sticker.deleteOne();

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
    const deleteIds = req.params.sticker_id.trim().split(",");

    const sticker = await Sticker.find();

    deleteIds.map((id) => {
      sticker.map(async (sticker) => {
        if (sticker._id == id) {
          if (fs.existsSync(sticker.sticker)) {
            return fs.unlinkSync(sticker.sticker);
          }
          await sticker.deleteOne();
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
