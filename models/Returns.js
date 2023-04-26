const mongoose = require("mongoose");

const Return = mongoose.model(
  "Return",
  new mongoose.Schema({
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Rental",
    },
    date: {
      type: Date,
      required: true,
      default: new Date(),
    },
  })
);

module.exports = Return;
