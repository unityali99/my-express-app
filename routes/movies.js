const express = require("express");
const Movie = require("../models/Movie");
const { validateMovie } = require("../utils");
const { checkIdRoute, checkMainRoute, auth } = require("../middlewares");

const router = express.Router();

router.param("id", checkIdRoute);

router.use(auth);
router.use(checkMainRoute);

router
  .route("/")
  .get(async (req, res) => {
    try {
      const movies = await Movie.find().populate("genre", { name: 1, _id: 0 });
      res.status(200).send(movies);
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .post(async (req, res) => {
    try {
      const { error } = validateMovie(req.body);
      if (error) return res.status(422).send(error.details[0].message);
      const newMovie = await Movie.create(req.body);
      res.status(201).send(`Movie created successfully => ${newMovie}`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id).populate("genre", {
        name: 1,
        _id: 0,
      });
      if (!movie) return res.status(404).send("Movie not found");
      res.status(200).send(movie);
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .put(async (req, res) => {
    try {
      const { error } = validateMovie(req.body);
      if (error) return res.status(422).send(error.details[0].message);
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedMovie) return res.status(404).send("Movie not found");
      res.status(200).send(updatedMovie);
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .delete(async (req, res) => {
    try {
      const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
      if (!deletedMovie) return res.status(404).send("Movie not found");
      res.status(200).send(`Movie was deleted => ${deletedMovie}`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

module.exports = router;
