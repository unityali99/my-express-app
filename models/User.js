const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  })
);

module.exports = User;
