const Feedback = require("./feedback.model");
const User = require("../user/user.model");
const { deleteFile } = require("../../util/deleteFile");
const fs = require("fs");
const {exit} = require('process');

exports.index = async (req, res, next) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: true,
      message: "Success",
      data: feedback,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "server Error",
    });
  }
};

exports.store = async (req, res, next) => {
  try {
    if (!req.body) {
      return res
        .status(200)
        .json({ status: false, message: "Inavlid Details." });
    }
    if (!req.body.userid) {
      return res
        .status(200)
        .json({ status: false, message: "Inavlid userid." });
    }
    const user = await User.findById(req.body.userid);  
    if(!user) {
        return res
        .status(200)
        .json({ status: false, message: "User not found..!" });
    }
    if (!req.body.email) {
      return res.status(200).json({ status: false, message: "Inavlid email." });
    }
    if (!req.body.feedbackMsg) {
      return res
        .status(200)
        .json({ status: false, message: "Inavlid message." });
    }
    // if (!req.file) {
    //   return res
    //     .status(200)
    //     .json({ status: false, message: "Please select an image." });
    // }
    
    const feedback = await Feedback.create({
      userid: req.body.userid,
      email: req.body.email,
      feedbackMsg: req.body.feedbackMsg,
      icon: req.file.path,
    });
    
    
    return res.status(200).json({ status: true, message: "Success", data: feedback})

  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "server Error",
    });
  }
};

exports.destroy = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.feedback_id);
        if (!feedback) {
            return res.status(200).json({ status: false, message: "Feedback not found" });
        }
        if (fs.existsSync(feedback.icon)) {
            fs.unlinkSync(feedback.icon);
        }
        await feedback.deleteOne();
        return res.status(200).json({ status: true, message: 'delete', result: true });

    } catch (error) {
        return res.status(500).json({ status: false, error: error.message || "server error" });
    }
} 

exports.destroyAll = async (req, res) => {
    try {
        const deleteIds = req.params.feedback_id.trim().split(",");
        const feedback = await Feedback.find();
        deleteIds.map((id) => {
            feedback.map(async (feedback) => {
                if(feedback_id == id) {
                    if (fs.existsSync(feedback.icon)) {
                        return fs.unlinkSync(feedback.icon);
                    }
                    await feedback.deleteOne();
                }
            })
        })
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message || "server error" });
    }
}
