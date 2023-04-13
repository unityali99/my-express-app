const express = require("express");
const Rental = require("../models/Rental");
const { validateRental } = require("../utils");
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
      const rentals = await Rental.find()
        .populate("customer", { _id: 0 })
        .populate("movie", { _id: 0 });
      res.status(200).send(rentals);
    })
  )
  .post(
    auth,
    asyncMiddleWare(async (req, res) => {
      const { error } = validateRental(req.body);
      if (error) return res.status(422).send(error.details[0].message);
      const newRental = await Rental.create(req.body);
      res.status(201).send(`Rental created successfully => ${newRental}`);
    })
  );

router
  .route("/:id")
  .get(
    auth,
    asyncMiddleWare(async (req, res) => {
      const rental = await Rental.findById(req.params.id);
      if (!rental) return res.status(404).send("Rental not found");
      res.status(200).send(rental);
    })
  )
  .put(
    auth,
    isAdmin,
    asyncMiddleWare(async (req, res) => {
      const { error } = validateRental(req.body);
      if (error) return res.status(422).send(error.details[0].message);
      const updatedRental = await Rental.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!updatedRental) return res.status(404).send("Rental not found");
      res.status(200).send(updatedRental);
    })
  )
  .delete(
    auth,
    isAdmin,
    asyncMiddleWare(async (req, res) => {
      const deletedRental = await Rental.findByIdAndDelete(req.params.id);
      if (!deletedRental) return res.status(404).send("Rental not found");
      res.status(200).send(`${deletedRental} has been removed`);
    })
  );

module.exports = router;
