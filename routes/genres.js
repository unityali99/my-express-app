const express = require("express");
const { validateGenre } = require("../utilities/utils");
const {
  checkIdRoute,
  checkMainRoute,
  auth,
  isAdmin,
  asyncMiddleWare,
} = require("../utilities/middlewares");

const Genre = require("../models/Genre");
const router = express.Router();

router.param("id", checkIdRoute);

router.use(checkMainRoute);

router
  .route("/")
  .get(
    asyncMiddleWare(async (req, res) => {
      const genres = await Genre.find();
      res.send(genres);
    })
  )
  .post(
    auth,
    asyncMiddleWare(async (req, res) => {
      const { error } = validateGenre(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      const genre = await Genre.create(req.body);
      res.status(200).send(`Genre ${genre} added successfully.`);
    })
  );

router
  .route("/:id")
  .get(
    asyncMiddleWare(async (req, res) => {
      const genre = await Genre.findById(req.params.id);
      if (!genre)
        return res
          .status(404)
          .send(`There is no genre with ID ${req.params.id}`);
      res.status(200).send(genre);
    })
  )
  .put(
    auth,
    isAdmin,
    asyncMiddleWare(async (req, res) => {
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
    })
  )
  .delete(
    auth,
    isAdmin,
    asyncMiddleWare(async (req, res) => {
      const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
      if (!deletedGenre)
        return res
          .status(404)
          .send(`There is no genre with the ID ${req.params.id}`);

      res.send(`Deleted genre: ${deletedGenre}`);
    })
  );

module.exports = router;
