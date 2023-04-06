const express = require("express");
const Rental = require("../models/Rental");
const { validateRental } = require("../utils");
const {
  checkIdRoute,
  checkMainRoute,
  auth,
  isAdmin,
} = require("../middlewares");

const router = express.Router();

router.param("id", checkIdRoute);

router.use(checkMainRoute);

router
  .route("/")
  .get(async (req, res) => {
    try {
      const rentals = await Rental.find()
        .populate("customer", { _id: 0 })
        .populate("movie", { _id: 0 });
      res.status(200).send(rentals);
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .post(auth, async (req, res) => {
    try {
      const { error } = validateRental(req.body);
      if (error) return res.status(422).send(error.details[0].message);
      const newRental = await Rental.create(req.body);
      res.status(201).send(`Rental created successfully => ${newRental}`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

router
  .route("/:id")
  .get(auth, async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id);
      if (!rental) return res.status(404).send("Rental not found");
      res.status(200).send(rental);
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .put(auth, isAdmin, async (req, res) => {
    try {
      const { error } = validateRental(req.body);
      if (error) return res.status(422).send(error.details[0].message);
      const updatedRental = await Rental.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!updatedRental) return res.status(404).send("Rental not found");
      res.status(200).send(updatedRental);
    } catch (err) {
      res.status(400).send(err);
    }
  })
  .delete(auth, isAdmin, async (req, res) => {
    try {
      const deletedRental = await Rental.findByIdAndDelete(req.params.id);
      if (!deletedRental) return res.status(404).send("Rental not found");
      res.status(200).send(`${deletedRental} has been removed`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

module.exports = router;
