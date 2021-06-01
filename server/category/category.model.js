const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    icon: {
      type: String,
    },
    name: {
      type: String,
    },
    isTop: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
