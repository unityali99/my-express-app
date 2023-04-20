const mongoose = require("mongoose");

function dbStartup() {
  mongoose
    .connect(process.env.DB)
    .then(() => console.info("Connected to mongoDB ..."));
}

module.exports = dbStartup;
