const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      // required: true,
    },
    image: {
      type: String,
    },
    flag: {
      type: Boolean,
      default: false,
    },
    key: {
      type: String,
      default: null,
    },
    package: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
