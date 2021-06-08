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
    imageUrl: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
