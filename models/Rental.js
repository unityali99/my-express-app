const mongoose = require("mongoose");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    date: { type: Date, required: true, default: new Date() },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Movie",
    },
  })
);

module.exports = Rental;
