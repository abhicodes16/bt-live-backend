const ChatTopic = require("./chatTopic.model");
const Chat = require("../chat/chat.model");
const User = require("../user/user.model");
const arraySort = require("array-sort");

const dayjs = require("dayjs");

exports.chatUserList = async (req, res) => {
  try {
    let now = dayjs();
    const isUserExist = await User.findById(req.query.user_id);

    if (!isUserExist) {
      return res.status(200).json({ status: false, message: "user not found" });
    }

    const user = await ChatTopic.find({
      $or: [
        { sender_id: req.query.user_id },
        {
          receiver_id: req.query.user_id,
        },
      ],
    });

    if (user.length === 0) {
      return res
        .status(200)
        .json({ status: false, message: "no data", data: [] });
    }

    if (!user) {
      throw new Error();
    }
    const data = await user.map((data) => ({
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
    }));

    let list = [];
    data.map(async (data) => {
      if (req.query.user_id == data.sender_id) {
        list.push(data.receiver_id);
      } else {
        list.push(data.sender_id);
      }
    });

    let data_ = [];

    for (let i = 0; i < list.length; i++) {
      let user = await User.findById(list[i]._id);
      if (user) {
        let chatTopic = await ChatTopic.findOne({
          $and: [
            { sender_id: list[i] },
            {
              receiver_id: req.query.user_id,
            },
          ],
        });

        if (chatTopic) {
          let chat = await Chat.findOne({
            topic: chatTopic._id,
          }).sort({ createdAt: -1 });

          if (chat) {
            let time = "";
            time =
              now.diff(chat.createdAt, "minute") <= 60 &&
              now.diff(chat.createdAt, "minute") >= 0
                ? now.diff(chat.createdAt, "minute") + " minutes ago"
                : now.diff(chat.createdAt, "hour") >= 24
                ? now.diff(chat.createdAt, "day") >= 30
                  ? now.diff(chat.createdAt, "month") + " months ago"
                  : now.diff(chat.createdAt, "day") + " days ago"
                : now.diff(chat.createdAt, "hour") + " hours ago";

            data_.push({
              _id: user ? user._id : "",
              name: user ? user.name : "",
              image: user ? user.image : "",
              country_name: user ? user.country : "",
              message: chat ? chat.message : "",
              topic: chat ? chat.topic : "",
              time: time === "0 minutes ago" ? "now" : time,
              createdAt: chat.createdAt,
            });
          }
        }

        let chatTopic_ = await ChatTopic.findOne({
          $and: [
            { sender_id: req.query.user_id },
            {
              receiver_id: list[i],
            },
          ],
        });

        if (chatTopic_) {
          let chat = await Chat.findOne({
            topic: chatTopic_._id,
          }).sort({ createdAt: -1 });

          let time = "";
          if (chat) {
            time =
              now.diff(chat.createdAt, "minute") <= 60 &&
              now.diff(chat.createdAt, "minute") >= 0
                ? now.diff(chat.createdAt, "minute") + " minutes ago"
                : now.diff(chat.createdAt, "hour") >= 24
                ? now.diff(chat.createdAt, "day") >= 30
                  ? now.diff(chat.createdAt, "month") + " months ago"
                  : now.diff(chat.createdAt, "day") + " days ago"
                : now.diff(chat.createdAt, "hour") + " hours ago";

            data_.push({
              _id: user ? user._id : "",
              name: user ? user.name : "",
              image: user ? user.image : "",
              country_name: user ? user.country : "",
              message: chat ? chat.message : "",
              topic: chat ? chat.topic : "",
              time: time === "0 minutes ago" ? "now" : time,
              createdAt: chat.createdAt,
            });
          }
        }
      }
    }

    const test = arraySort(data_, "createdAt", { reverse: true });

    return res
      .status(200)
      .json({ status: true, message: "success", data: test });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      status: error.status,
      message: error.errors || error.message || "server error",
    });
  }
};

exports.store = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details." });
    if (!req.body.sender_id)
      return res
        .status(200)
        .json({ status: false, message: "sender user id is required" });
    if (!req.body.receiver_id)
      return res
        .status(200)
        .json({ status: false, message: "receiver user id is required" });

    const sender = await User.findById(req.body.sender_id);
    if (!sender) {
      return res
        .status(200)
        .json({ status: false, message: "sender user is not found" });
    }
    const receiver = await User.findById(req.body.receiver_id);
    if (!receiver) {
      return res
        .status(200)
        .json({ status: false, message: "receiver user is not found" });
    }

    const isTopicExist = await ChatTopic.findOne({
      $and: [
        { sender_id: req.body.sender_id },
        {
          receiver_id: req.body.receiver_id,
        },
      ],
    });

    if (isTopicExist) {
      return res
        .status(200)
        .json({ status: true, message: "success", data: isTopicExist });
    }
    const isTopicExist_ = await ChatTopic.findOne({
      $and: [
        { sender_id: req.body.receiver_id },
        {
          receiver_id: req.body.sender_id,
        },
      ],
    });

    if (isTopicExist_) {
      return res
        .status(200)
        .json({ status: true, message: "success", data: isTopicExist_ });
    }

    const chatTopic = await ChatTopic.create({
      sender_id: req.body.sender_id,
      receiver_id: req.body.receiver_id,
    });

    if (!chatTopic) {
      throw new Error();
    }

    return res
      .status(200)
      .json({ status: true, message: "success", data: chatTopic });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.search = async (req, res) => {
  try {
    var response = [];
    let now = dayjs();
    if (req.body.name) {
      response = await User.find({
        name: { $regex: req.body.name, $options: "i" },
      });

      let data = [];
      for (let i = 0; i < response.length; i++) {
        let chatTopic = await ChatTopic.findOne({
          $and: [
            { sender_id: response[i]._id },
            {
              receiver_id: req.body.user_id,
            },
          ],
        });
        let chatTopic_ = await ChatTopic.findOne({
          $and: [
            { sender_id: req.body.user_id },
            {
              receiver_id: response[i]._id,
            },
          ],
        });

        if (chatTopic) {
          let chat = await Chat.findOne({
            topic: chatTopic._id,
          }).sort({ createdAt: -1 });

          let time = "";

          if (chat) {
            time =
              now.diff(chat.createdAt, "minute") <= 60 &&
              now.diff(chat.createdAt, "minute") >= 0
                ? now.diff(chat.createdAt, "minute") + " minutes ago"
                : now.diff(chat.createdAt, "hour") >= 24
                ? now.diff(chat.createdAt, "day") >= 30
                  ? now.diff(chat.createdAt, "month") + " months ago"
                  : now.diff(chat.createdAt, "day") + " days ago"
                : now.diff(chat.createdAt, "hour") + " hours ago";
          }

          data.push({
            _id: response[i]._id,
            name: response[i].name,
            image: response[i].image,
            country_name: response[i].country,
            message: chat ? chat.message : "",
            topic: chat ? chat.topic : "",
            time: time === "0 minutes ago" ? "now" : time,
            createdAt: chat ? chat.createdAt : "",
          });
          // break;
        }

        // console.log(response[i]._id);

        // console.log(chatTopic_);
        else if (chatTopic_) {
          let chat = await Chat.findOne({
            topic: chatTopic_._id,
          }).sort({ createdAt: -1 });

          let time = "";
          if (chat) {
            time =
              now.diff(chat.createdAt, "minute") <= 60 &&
              now.diff(chat.createdAt, "minute") >= 0
                ? now.diff(chat.createdAt, "minute") + " minutes ago"
                : now.diff(chat.createdAt, "hour") >= 24
                ? now.diff(chat.createdAt, "day") >= 30
                  ? now.diff(chat.createdAt, "month") + " months ago"
                  : now.diff(chat.createdAt, "day") + " days ago"
                : now.diff(chat.createdAt, "hour") + " hours ago";
          }

          data.push({
            _id: response[i]._id,
            name: response[i].name,
            image: response[i].image,
            country_name: response[i].country,
            message: chat ? chat.message : "",
            topic: chat ? chat.topic : "",
            time: time === "0 minutes ago" ? "now" : time,
            createdAt: chat ? chat.createdAt : "",
          });
        } else {
          data.push({
            _id: response[i]._id,
            name: response[i].name,
            image: response[i].image ? response[i].image : "",
            country_name: response[i].country,
            message: "",
            topic: "",
            time: "New User",
            createdAt: "",
          });
        }
      }

      const test = arraySort(data, "createdAt", { reverse: true });

      return res
        .status(200)
        .json({ status: true, message: "success", data: test });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message || "server error" });
  }
};
