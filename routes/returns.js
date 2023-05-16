const Rental = require("../models/Rental");
const Return = require("../models/Returns");
const { asyncMiddleWare, auth } = require("../utilities/middlewares");
const { validateReturn } = require("../utilities/utils");

const express = require("express");
const router = express.Router();

router.route("/").post(
  auth,
  asyncMiddleWare(async (req, res) => {
    const { error } = validateReturn(req.body);
    if (error) return res.status(422).send(error.details[0].message);
    const rental = await Rental.findOne({ _id: req.body.rental });
    const returnExists = await Return.findOne({ rental: req.body.rental });
    if (!rental)
      return res
        .status(404)
        .send("There is no rental related to the provided rental id");
    if (returnExists)
      return res
        .status(409)
        .send("Return with the provided rental id already exists");
    const savedReturn = await Return.create(req.body);
    console.log(savedReturn);
    res.status(200).send("Return created successfully");
  })
);

module.exports = router;
