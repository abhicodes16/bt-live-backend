const Image = require("../image/image.model");
const User = require("../user/user.model");
const LiveView = require("../liveView/liveView.model");
const shuffleArray = require("../../util/shuffle");
const { serverPath } = require("../../util/serverPath");

exports.randomImgName = async (req, res) => {
  try {
    let image;
    if (req.query.country === "GLOBAL") {
      image = await Image.find()
        .sort({
          createdAt: 1,
        })
        .populate("country");
    } else {
      image = await Image.find({ country: req.query.country })
        .sort({
          createdAt: 1,
        })
        .populate("country");
    }

    let mainArr = [];
    // const obj = image.map(async (img, index) => {
    //   let count = 0;
    //   count = await LiveView.aggregate([{ $match: { user_id: img.user_id } }]);
    //   console.log(count.length);
    //   const obj_ = {
    //     image: img.type === "real" ? img.image : serverPath + img.image,
    //     host_id: img.user_id,
    //     name: img.name,
    //     country_id: img.country,
    //     type: img.type,
    //     coin: img.type === "real" ? img.coin : 0,
    //     token: img.type === "real" ? img.token : "",
    //     channel: img.type === "real" ? img.channel : "",
    //     view: count.length,
    //   };
    //   mainArr.push(obj_);
    // });

    for (var i = 0; i < image.length; i++) {
      let count = 0;
      // if (image[i].type === "real") {
      count = await LiveView.aggregate([
        { $match: { user_id: image[i].user_id } },
      ]);
      // }

      const obj_ = {
        image:
          image[i].type === "real"
            ? image[i].image
            : serverPath + image[i].image,
        host_id: image[i].user_id,
        name: image[i].name,
        country_id: image[i].country._id,
        country_name: image[i].country.name,
        type: image[i].type,
        rate: image[i].rate,
        coin: image[i].type === "real" ? image[i].coin : 0,
        token: image[i].type === "real" ? image[i].token : "",
        channel: image[i].type === "real" ? image[i].channel : "",
        view: count.length,
      };
      mainArr.push(obj_);
    }

    for (var i = mainArr.length - 1; i > 0; i--) {
      if (mainArr[i].type === "fake") {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = mainArr[i];
        mainArr[i] = mainArr[j];
        mainArr[j] = temp;
      }
    }

    mainArr.reverse();

    return res.status(200).json({
      status: true,
      message: "success",
      data: mainArr,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.isValidHost = async (req, res) => {
  try {
    const user = await User.findById(req.query.host_id);

    if (!user)
      return res.status(200).json({ status: false, message: "user not found" });

    const image = await Image.findOne({ user_id: req.query.host_id });

    if (image) {
      return res.status(200).json({ status: true, message: "success" });
    } else {
      return res.status(200).json({ status: false, message: "not found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
