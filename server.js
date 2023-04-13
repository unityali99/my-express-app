const express = require("express");
require("dotenv").config();

const genresRoute = require("./routes/genres");
const customersRoute = require("./routes/customers");
const moviesRoute = require("./routes/movies");
const rentalRoute = require("./routes/rentals");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");
const { error } = require("./middlewares");
const app = express();
const favicon = require("serve-favicon");
const path = require("path");

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jemggly.mongodb.net/movies`
);

app.use(favicon(path.join(__dirname, "favicon.png")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/genres", genresRoute);
app.use("/api/customers", customersRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/rentals", rentalRoute);
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use(error);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
