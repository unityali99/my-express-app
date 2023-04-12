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

mongoose
  .connect(`mongodb://localhost:27017`)
  .catch((reason) => console.log(reason.message));

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
