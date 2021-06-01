const User = require("../user/user.model");
const Follower = require("../follower/follower.model");
const LiveView = require("../liveView/liveView.model");
const Image = require("../image/image.model");
const { Mongoose } = require("mongoose");

exports.favourite = async (req, res) => {
  try {
    const user = User.findById(req.query.user_id);
    if (!user) {
      return res.status(200).json({ status: false, message: "user not found" });
    }

    Follower.find({ from_user_id: req.query.user_id }, { to_user_id: 1 })
      .populate("to_user_id")
      .exec(async (err, followers) => {
        if (err)
          return res
            .status(500)
            .send({ status: false, message: "Internal server error" });
        else {
          const image = await Image.find().populate("country");
          // console.log(image);
          const list = [];
          followers.map(async (data) => {
            await image.map(async (img) => {
              if (img.user_id) {
                if (data.to_user_id._id.toString() === img.user_id.toString())
                  // var chk = list.findIndex(
                  //   (data_) => data_._id === data.to_user_id._id
                  // );

                  // if (chk === -1) {
                  list.push({
                    image: img.image,
                    host_id: img.user_id,
                    name: img.name,
                    country_id: img.country._id,
                    country_name: img.country.name,
                    type: img.type,
                    coin: img.type === "real" ? img.coin : 0,
                    token: img.type === "real" ? img.token : "",
                    channel: img.type === "real" ? img.channel : "",
                    view: 0,
                  });
                // }
              }
            });
          });
          return res.status(200).send({
            status: true,
            message: "favorite list successful",
            data: list,
            // total: total,
          });
        }
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
