const LiveView = require("./liveView.model");
const LiveComment = require("../liveComment/liveComment.model");

exports.userDetail = async (req, res, next) => {
  try {
    const view = await LiveView.find({ token: req.get("token") }).populate(
      "user_id"
    );
    if (!view) {
      throw new Error();
    }

    const data = view.map((data) => ({
      user_id: data.user_id._id,
      name: data.name,
      image: data.image,
      token: data.token,
      country_name: data.user_id.country,
    }));

    console.log(data);
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    console.log(error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "server error" });
  }
};

exports.store = async (req, res, next) => {
  try {
    const view = new LiveView();

    view.user_id = req.body.user_id;
    view.name = req.body.name;
    view.image = req.body.image;
    view.token = req.body.token;

    await view.save();

    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "server error",
    });
  }
};
exports.delete = async (req, res, next) => {
  try {
    await LiveView.deleteMany({ token: req.body.token })
      .then(function () {
        // console.log("Data deleted"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
    await LiveComment.deleteMany({ token: req.body.token })
      .then(function () {
        // console.log("Data deleted"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(error.status || 500)
      .json({ error: error.errors || error.message || "server error" });
  }
};
