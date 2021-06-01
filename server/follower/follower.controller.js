const Follower = require("./follower.model");
const User = require("../user/user.model");
const Notification = require("../notification/notification.model");

exports.follow = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });
    if (!req.body.from_user_id)
      return res
        .status(200)
        .json({ status: false, message: "from user id is required" });
    if (!req.body.to_user_id)
      return res
        .status(200)
        .json({ status: false, message: "to user id is required" });

    const fromUserExist = await User.findById(req.body.from_user_id);

    if (!fromUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "user id is not exist" });
    }

    const toUserExist = await User.findById(req.body.to_user_id);

    if (!toUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "user id is not exist" });
    }

    const followUser = await Follower.findOne({
      $and: [
        {
          from_user_id: req.body.from_user_id,
          to_user_id: req.body.to_user_id,
        },
      ],
    });

    if (followUser) {
      return res
        .status(200)
        .send({ status: true, message: "Follow successful test" });
    }

    const followerData = {
      from_user_id: req.body.from_user_id, //Bhagavati
      to_user_id: req.body.to_user_id, //Urvi
    };

    const addFollower = new Follower(followerData);

    const user = await User.findById(req.body.from_user_id);

    const notification = new Notification();

    notification.title = "New Follower";
    notification.description = `${user.name} started following you`;
    notification.type = "follow";
    notification.image = user.image;
    notification.user_id = req.body.to_user_id;

    await notification.save();

    addFollower.save(async (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ status: false, message: "Internal server error" });
      else {
        await User.update(
          { _id: req.body.from_user_id },
          { $inc: { following_count: 1 } }
        );
        await User.update(
          { _id: req.body.to_user_id },
          { $inc: { followers_count: 1 } }
        );

        return res
          .status(200)
          .send({ status: true, message: "Follow successful" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.unFollow = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });
    if (!req.body.from_user_id)
      return res
        .status(200)
        .json({ status: false, message: "from user id is required" });
    if (!req.body.to_user_id)
      return res
        .status(200)
        .json({ status: false, message: "to user id is required" });

    Follower.deleteOne({
      from_user_id: req.body.from_user_id,
      to_user_id: req.body.to_user_id,
    }).exec(async (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ status: false, message: "Internal server error" });
      else {
        await User.update(
          { _id: req.body.from_user_id },
          { $inc: { following_count: -1 } }
        );
        await User.update(
          { _id: req.body.to_user_id },
          { $inc: { followers_count: -1 } }
        );

        return res
          .status(200)
          .send({ status: true, message: "UnFollow successful" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.followerList = async (req, res) => {
  try {
    // const start = req.body.start ? parseInt(req.body.start) : 0;
    // const limit = req.body.limit ? parseInt(req.body.limit) : 5;
    if (req.body.user_id) {
      Follower.find({ to_user_id: req.body.user_id }, { from_user_id: 1 })
        .populate("from_user_id")
        // .skip(start)
        // .limit(limit)
        .exec((err, followers) => {
          if (err)
            return res
              .status(500)
              .send({ status: false, message: "Internal server error" });
          else {
            const data = followers.map((data) => ({
              _id: data.from_user_id ? data.from_user_id._id : "",
              bio: data.from_user_id ? data.from_user_id.bio : "",
              rate: data.from_user_id ? data.from_user_id.rate : 0,
              image: data.from_user_id ? data.from_user_id.image : "",
              country: data.from_user_id ? data.from_user_id.country : "",
              username: data.from_user_id ? data.from_user_id.username : "",
              identity: data.from_user_id ? data.from_user_id.identity : "",
              name: data.from_user_id ? data.from_user_id.name : "",
              coin: data.from_user_id ? data.from_user_id.coin : 0,
              followers_count: data.from_user_id
                ? data.from_user_id.followers_count
                : 0,
              following_count: data.from_user_id
                ? data.from_user_id.following_count
                : 0,
              fcm_token: data.from_user_id ? data.from_user_id.fcm_token : "",
              dailyTaskFinishedCount: data.from_user_id
                ? data.from_user_id.dailyTaskFinishedCount
                : 0,
              createdAt: data.from_user_id ? data.from_user_id.createdAt : "",
              updatedAt: data.from_user_id ? data.from_user_id.updatedAt : "",
              __v: data.from_user_id ? data.from_user_id.__v : 0,
            }));
            return res.status(200).send({
              status: true,
              message: "Followers list successful",
              data,
              // total: total,
            });
          }
        });
    } else {
      return res
        .status(200)
        .send({ status: false, message: "Invalid details" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.followingList = async (req, res) => {
  try {
    // const start = req.body.start ? parseInt(req.body.start) : 0;
    // const limit = req.body.limit ? parseInt(req.body.limit) : 5;
    if (req.body.user_id) {
      Follower.find({ from_user_id: req.body.user_id }, { to_user_id: 1 })
        .populate("to_user_id")
        // .skip(start)
        // .limit(limit)
        .exec((err, followers) => {
          if (err)
            return res
              .status(500)
              .send({ status: false, message: "Internal server error" });
          else {
            const data = followers.map((follower) => ({
              _id: follower.to_user_id ? follower.to_user_id._id : "",
              bio: follower.to_user_id ? follower.to_user_id.bio : "",
              rate: follower.to_user_id ? follower.to_user_id.rate : 0,
              country: follower.to_user_id ? follower.to_user_id.country : "",
              image: follower.to_user_id ? follower.to_user_id.image : "",
              username: follower.to_user_id ? follower.to_user_id.username : "",
              identity: follower.to_user_id ? follower.to_user_id.identity : "",
              name: follower.to_user_id ? follower.to_user_id.name : "",
              coin: follower.to_user_id ? follower.to_user_id.coin : 0,
              followers_count: follower.to_user_id
                ? follower.to_user_id.followers_count
                : 0,
              following_count: follower.to_user_id
                ? follower.to_user_id.following_count
                : 0,
              fcm_token: follower.to_user_id
                ? follower.to_user_id.fcm_token
                : "",
              dailyTaskFinishedCount: follower.to_user_id
                ? follower.to_user_id.dailyTaskFinishedCount
                : 0,
              createdAt: follower.to_user_id
                ? follower.to_user_id.createdAt
                : "",
              updatedAt: follower.to_user_id
                ? follower.to_user_id.updatedAt
                : "",
              __v: follower.to_user_id ? follower.to_user_id.__v : 0,
            }));
            return res.status(200).send({
              status: true,
              message: "Following list successful",
              data,
              // total: total,
            });
          }
        });
    } else {
      return res
        .status(200)
        .send({ status: false, message: "Invalid details" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.checkIsFollow = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });
    if (!req.body.host_id)
      return res
        .status(200)
        .json({ status: false, message: "host user id is required" });
    if (!req.body.guest_id)
      return res
        .status(200)
        .json({ status: false, message: "guest user id is required" });

    const hostUserExist = await User.findById(req.body.host_id);

    if (!hostUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "user id is not exist" });
    }

    const guestUserExist = await User.findById(req.body.guest_id);

    if (!guestUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "user id is not exist" });
    }

    const follower = await Follower.findOne({
      to_user_id: req.body.host_id,
    }).where({ from_user_id: req.body.guest_id });

    if (follower) {
      return res.status(200).json({ status: true, message: "follow" });
    } else {
      return res.status(200).json({ status: false, message: "not follow" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
