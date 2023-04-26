const express = require("express");
const genresRoute = require("../routes/genres");
const customersRoute = require("../routes/customers");
const moviesRoute = require("../routes/movies");
const rentalRoute = require("../routes/rentals");
const usersRoute = require("../routes/users");
const authRoute = require("../routes/auth");
const returnsRoute = require("../routes/returns");
const { error } = require("../utilities/middlewares");
const favicon = require("serve-favicon");
const path = require("path");

function appStartup(app) {
  app.use(favicon(path.join(__dirname, "../public", "favicon.png")));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/genres", genresRoute);
  app.use("/api/customers", customersRoute);
  app.use("/api/movies", moviesRoute);
  app.use("/api/rentals", rentalRoute);
  app.use("/api/users", usersRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/returns", returnsRoute);
  app.use(error);
}

module.exports = appStartup;
