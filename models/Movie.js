const mongoose = require("mongoose");

const Movie = mongoose.model("Movie", {
  name: { type: String, max: 20, required: true, trim: true },
  price: {
    type: Number,
    required: true,
    // get: function (value) {
    //   return Math.floor(value);
    // },
    // set: function (value) {
    //   return Math.floor(value);
    // },
  },
  releaseYear: { type: Number, required: true },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Genre",
  },
});

module.exports = Movie;
