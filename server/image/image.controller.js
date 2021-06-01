const Image = require("./image.model");
const { deleteVideo, deleteFile } = require("../../util/deleteFile");
const fs = require("fs");

exports.index = async (req, res, next) => {
  try {
    const image = await Image.find()
      .populate("country")
      .sort({ createdAt: -1 });

    if (!image) {
      throw new Error();
    }

    return res
      .status(200)
      .json({ status: false, message: "Success", data: image });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

exports.store = async (req, res, next) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details." });
    if (!req.body.name)
      return res
        .status(200)
        .json({ status: false, message: "name is required" });
    if (!req.body.country)
      return res
        .status(200)
        .json({ status: false, message: "country is required" });
    if (!req.files)
      return res
        .status(200)
        .json({ status: false, message: "please select an image" });

    var remove_coma = req.body.name.replace(/,\s*$/, "");
    var name = remove_coma.split(",");

    var names = new Array(3).fill(name).flat();

    const images = req.files.map((image, index) => ({
      country: req.body.country,
      image: image.path,
      name: names[index],
    }));

    const image = await Image.insertMany(images);

    if (!image) {
      throw new Error();
    }

    let data = [];
    for (let i = 0; i < image.length; i++) {
      data.push(await Image.findById(image[i]._id).populate("country"));
    }
    return res
      .status(200)
      .json({ status: false, message: "Success", data: data });
  } catch (error) {
    console.log(error);
    deleteVideo(req.files);
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
        .json({ status: false, message: "Invalid details." });
    if (!req.body.name)
      return res
        .status(200)
        .json({ status: false, message: "name is required" });
    if (!req.body.country)
      return res
        .status(200)
        .json({ status: false, message: "country is required" });

    const image_ = await Image.findById(req.params.image_id);

    if (!image_) {
      return res
        .status(200)
        .json({ status: false, message: "Image not found" });
    }

    if (req.file) {
      if (fs.existsSync(image_.image)) {
        fs.unlinkSync(image_.image);
      }

      image_.image = req.file.path;
    }

    image_.name = req.body.name;
    image_.country = req.body.country;

    await image_.save();

    const image = await Image.findById(image_._id).populate("country");

    return res
      .status(200)
      .json({ status: true, message: "Update", data: image });
  } catch (error) {
    console.log(error);
    if (req.file) {
      deleteFile(req.file);
    }
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.destroy = async (req, res) => {
  try {
    const image = await Image.findById(req.params.image_id);
    if (!image) {
      return res
        .status(200)
        .json({ status: false, message: "Image not found" });
    }

    if (fs.existsSync(image.image)) {
      fs.unlinkSync(image.image);
    }

    await image.deleteOne();

    return res
      .status(200)
      .json({ status: true, message: "Delete", result: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
