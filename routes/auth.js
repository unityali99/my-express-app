const express = require("express");
const User = require("../models/User");
const { validateLogin } = require("../utils");
const { checkPost } = require("../middlewares");
const bcrypt = require("bcrypt");
const router = express.Router();

router.use(checkPost);

router.post("/", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(422).send(error.details[0].message);
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");
    if (!(await bcrypt.compare(req.body.password, user.password)))
      return res.status(400).send("Invalid email or password");
    const token = user.generateAuthToken();
    return res.status(200).send(token);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
