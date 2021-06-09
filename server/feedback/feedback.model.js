const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userid: { type: String },
    email: { type: String },
    feedbackMsg: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
