const express = require("express");
const { validateGenre, checkIdRoute, checkMainRoute } = require("../utils");
const Genre = require("../models/Genre");
const router = express.Router();

router.param("id", checkIdRoute);

router.use("/", checkMainRoute);

router
  .route("/")
  .get(async (req, res) => {
    try {
      const genres = await Genre.find();
      res.send(genres);
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .post(async (req, res) => {
    try {
      const { error } = validateGenre(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      const genre = await Genre.create(req.body);
      res.status(200).send(`Genre ${genre} added successfully.`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const genre = await Genre.findById(req.params.id);
      if (!genre)
        return res
          .status(404)
          .send(`There is no genre with ID ${req.params.id}`);
      res.status(200).send(genre);
    } catch (err) {
      console.log(err.message);
    }
  })
  .put(async (req, res) => {
    try {
      const { error } = validateGenre(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      const updatedGenre = await Genre.findByIdAndUpdate(
        req.params.id,
        { $set: { name: req.body.name } },
        {
          new: true,
        }
      );
      if (!updatedGenre)
        return res
          .status(404)
          .send(`There is no genre with the given ID ${req.params.id}`);
      res.send(`Updated genre: ${updatedGenre}`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .delete(async (req, res) => {
    try {
      const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
      if (!deletedGenre)
        return res
          .status(404)
          .send(`There is no genre with the ID ${req.params.id}`);

      res.send(`Deleted genre: ${deletedGenre}`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

module.exports = router;
