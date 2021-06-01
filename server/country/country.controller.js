const Country = require("./country.model");
const fs = require("fs");

exports.index = async (req, res) => {
  try {
    const country = await Country.find().sort({ createdAt: -1 });

    if (!country) {
      throw new Error();
    }

    return res.status(200).json({ status: true, message: "success", country });
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
    if (!req.body.name)
      return res
        .status(200)
        .json({ status: false, message: "Name is required!" });

    // if (!req.file) {
    //   return res
    //     .status(200)
    //     .json({ status: false, message: "please select an image." });
    // }

    const country = new Country();

    // country.image = req.file.path;
    country.name = req.body.name.toUpperCase();

    await country.save();

    return res.status(200).json({ status: true, message: "success", country });
  } catch (error) {
    console.log(error);
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
    if (!req.body.name)
      return res
        .status(200)
        .json({ status: false, message: "Name is required!" });

    const country = await Country.findById(req.params.country_id);

    if (!country) {
      throw new Error();
    }

    // if (req.file) {
    //   if (fs.existsSync(country.image)) {
    //     fs.unlinkSync(country.image);
    //   }
    //   country.image = req.file.path;
    // }

    country.name = req.body.name.toUpperCase();

    await country.save();

    return res.status(200).json({ status: true, message: "success", country });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
exports.destroy = async (req, res) => {
  try {
    const country = await Country.findById(req.params.country_id);

    if (!country) {
      throw new Error();
    }

    // if (fs.existsSync(country.image)) {
    //   fs.unlinkSync(country.image);
    // }

    await country.deleteOne();

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
    const deleteIds = req.params.country_id.trim().split(",");

    const country = await Country.deleteMany({ _id: { $in: deleteIds } });

    if (!country) {
      throw new Error();
    }

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
