const Category = require("./category.model");
const { deleteFile } = require("../../util/deleteFile");
const fs = require("fs");
const Gift = require("../gift/gift.model");

exports.index = async (req, res, next) => {
  try {
    const category = await Category.find().sort({ createdAt: -1 });

    if (!category) {
      return res
        .status(200)
        .json({ status: false, message: "Category not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Success", data: category });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
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

    if (!req.file)
      return res
        .status(200)
        .json({ status: false, message: "please select an image" });

    const category = await Category.create({
      icon: req.file.path,
      name: req.body.name,
    });

    if (!category) {
      throw new Error();
    }

    return res
      .status(200)
      .json({ status: true, message: "Success", data: category });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res.status(500).json({
      status: false,
      error: error.message || "Server Error",
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details." });
    if (!req.body.name)
      return res
        .status(200)
        .json({ status: false, message: "name is required" });

    const category = await Category.findById(req.params.category_id);
    if (!category) {
      return res
        .status(200)
        .json({ status: false, message: "Category not found" });
    }

    if (req.file) {
      if (fs.existsSync(category.icon)) {
        fs.unlinkSync(category.icon);
      }
      category.icon = req.file.path;
    }

    category.name = req.body.name;

    await category.save();

    return res
      .status(200)
      .json({ status: true, message: "Success", data: category });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.destroy = async (req, res) => {
  try {
    const category = await Category.findById(req.params.category_id);

    if (!category) {
      return res
        .status(200)
        .json({ status: false, message: "Category not found" });
    }

    // await Gift.deleteMany({ category: req.params.category_id });

    const gift = await Gift.find({ category: req.params.category_id });

    gift.map(async (data) => {
      if (fs.existsSync(data.icon)) {
        fs.unlinkSync(data.icon);
      }
      await data.deleteOne();
    });

    if (fs.existsSync(category.icon)) {
      fs.unlinkSync(category.icon);
    }

    await category.deleteOne();

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

exports.destroyAll = async (req, res) => {
  try {
    const deleteIds = req.params.category_id.trim().split(",");
    const category = await Category.find();
    // const gift = await gift.find();
    deleteIds.map((id) => {
      category.map(async (category) => {
        if (category._id == id) {
          if (fs.existsSync(category.icon)) {
            fs.unlinkSync(category.icon);
          }
          const gift = await Gift.find({ category: category._id });
          gift.map(async (gift) => {
            if (fs.existsSync(gift.icon)) {
              fs.unlinkSync(gift.icon);
            }
            await gift.deleteOne();
          });
          await category.deleteOne();
        }
      });
    });

    // const category = await Category.deleteMany({ _id: { $in: deleteIds } });

    // if (!category) {
    //   throw new Error();
    // }

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

exports.isTopToggle = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.category_id);

    if (!category) {
      return res
        .status(200)
        .json({ status: false, message: "Category not found" });
    }

    category.isTop = !category.isTop;
    await category.save();

    return res
      .status(200)
      .json({ status: true, message: "success", data: category });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
