const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: { type: String, min: 4, max: 25, required: true, trim: true },
    isGold: { type: Boolean, default: false },
    phone: { type: String, min: 10, max: 15, required: true, trim: true },
  })
);

module.exports = Customer;
