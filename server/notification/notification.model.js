const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    type: String,
    image: String,
    image: String,
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
