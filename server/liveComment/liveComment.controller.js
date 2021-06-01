const LiveComment = require("./liveComment.model");

exports.index = async (req, res, next) => {
  try {
    const comment = await LiveComment.find().where({
      token: req.get("token"),
    });
    if (!comment) {
      throw new Error();
    }

    const data = comment.map((data) => ({
      name: data.name,
      comment: data.comment,
      token: data.token,
    }));
    return res.status(200).json({ status: true, message: "success", data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
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
    if (!req.body.comment)
      return res
        .status(200)
        .json({ status: false, message: "comment is required" });
    if (!req.body.token)
      return res
        .status(200)
        .json({ status: false, message: "token is required" });

    const comment = new LiveComment();

    comment.name = req.body.name;
    comment.comment = req.body.comment;
    comment.token = req.body.token;

    await comment.save();

    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "server error",
    });
  }
};
