const mongoose = require("mongoose");

function dbStartup() {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jemggly.mongodb.net/movies`
    )
    .then(() => console.info("Connected to mongoDB ..."));
}

module.exports = dbStartup;
