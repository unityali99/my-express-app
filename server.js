require("dotenv").config();
const mongoose = require("mongoose");
const app = require("express")();
require("./startup/appStartup")(app);

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jemggly.mongodb.net/movies`
);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
