const mongoose = require("mongoose");

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 4,
      max: 15,
      lowercase: true,
      trim: true,
    },
  })
);

module.exports = Genre;
