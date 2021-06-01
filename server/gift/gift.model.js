const mongoose = require("mongoose");

const giftSchema = mongoose.Schema(
  {
    icon: String,
    coin: Number,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gift", giftSchema);
