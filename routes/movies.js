const express = require("express");
const Movie = require("../models/Movie");
const { validateMovie } = require("../utils");
const {
  checkIdRoute,
  checkMainRoute,
  auth,
  isAdmin,
  asyncMiddleWare,
} = require("../middlewares");

const router = express.Router();

router.param("id", checkIdRoute);

router.use(checkMainRoute);

router
  .route("/")
  .get(
    asyncMiddleWare(async (req, res) => {
      const movies = await Movie.find().populate("genre", { name: 1, _id: 0 });
      res.status(200).send(movies);
    })
  )
  .post(
    auth,
    asyncMiddleWare(async (req, res) => {
      const { error } = validateMovie(req.body);
      if (error) return res.status(422).send(error.details[0].message);
      const newMovie = await Movie.create(req.body);
      res.status(201).send(`Movie created successfully => ${newMovie}`);
    })
  );

router
  .route("/:id")
  .get(
    asyncMiddleWare(async (req, res) => {
      const movie = await Movie.findById(req.params.id).populate("genre", {
        name: 1,
        _id: 0,
      });
      if (!movie) return res.status(404).send("Movie not found");
      res.status(200).send(movie);
    })
  )
  .put(
    auth,
    isAdmin,
    asyncMiddleWare(async (req, res) => {
      const { error } = validateMovie(req.body);
      if (error) return res.status(422).send(error.details[0].message);
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedMovie) return res.status(404).send("Movie not found");
      res.status(200).send(updatedMovie);
    })
  )
  .delete(
    auth,
    isAdmin,
    asyncMiddleWare(async (req, res) => {
      const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
      if (!deletedMovie) return res.status(404).send("Movie not found");
      res.status(200).send(`Movie was deleted => ${deletedMovie}`);
    })
  );

module.exports = router;
