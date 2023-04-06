const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const { validateCustomer } = require("../utils");
const {
  checkIdRoute,
  checkMainRoute,
  auth,
  isAdmin,
} = require("../middlewares");

router.param("id", auth);
router.param("id", isAdmin);
router.param("id", checkIdRoute);

router.use(checkMainRoute);

router
  .route("/")
  .get(auth, isAdmin, async (req, res) => {
    try {
      const customers = await Customer.find();
      res.status(200).send(customers);
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .post(auth, isAdmin, async (req, res) => {
    try {
      if (!validateCustomer(req.body))
        return res.status(422).send(error.details[0].message);
      const customers = await Customer.create(req.body);
      res.status(201).send(`${customers} added to the database`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) return res.status(404).send("Customer not found");
      res.status(200).send(customer);
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .put(async (req, res) => {
    try {
      const { name, isGold, phone } = req.body;
      const { error } = validateCustomer(req.body);
      if (error) return res.status(422).send(error.details[0].message);
      const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: { name: name, isGold: isGold, phone: phone },
      });
      if (!updatedCustomer)
        return res
          .status(404)
          .send(`There is no customer with the given ID ${req.params.id}`);
      res.status(200).send(`Updated customer ${updatedCustomer}`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .delete(async (req, res) => {
    try {
      const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
      if (!deletedCustomer) return res.status(404).send(`Customer not found`);
      res.status(200).send(`Deleted customer ${deletedCustomer}`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

module.exports = router;
