const express = require("express");
const User = require("../models/User");
const _ = require("lodash");
const { validateUser, hashPassword } = require("../utils");
const { checkPost } = require("../middlewares");

const router = express.Router();

router.use(checkPost);

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(403).send("User already exists");
    if (error) return res.status(422).send(error.details[0].message);
    const hashedPass = await hashPassword(req.body.password);
    const createdUser = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPass,
      isAdmin: req.body.isAdmin,
    });
    const token = createdUser.generateAuthToken();
    res
      .header("X-Auth-Token", token)
      .status(201)
      .send(_.pick(createdUser, ["_id", "fullName", "email"]));
  })
);

module.exports = router;
