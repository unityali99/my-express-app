const Joi = require("joi");
const bcrypt = require("bcrypt");
const { isValidObjectId } = require("mongoose");

function validateGenre(obj) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(15).required(),
  });
  return schema.validate(obj);
}

function validateCustomer(obj) {
  const schema = Joi.object({
    isGold: Joi.boolean().default(false),
    name: Joi.string().min(4).max(25).required(),
    phone: Joi.string().min(10).max(15).required(),
  });
  return schema.validate(obj);
}

function validateMovie(obj) {
  const schema = Joi.object({
    name: Joi.string().max(20).required(),
    price: Joi.number().required(),
    releaseYear: Joi.number().required(),
    genre: Joi.string().min(24).max(24).required(),
  });
  return schema.validate(obj);
}

function validateRental(obj) {
  const schema = Joi.object({
    date: Joi.date().required(),
    customer: Joi.string().min(24).max(24).required(),
    movie: Joi.string().min(24).max(24).required(),
  });
  return schema.validate(obj);
}

function validateUser(obj) {
  const schema = Joi.object({
    fullName: Joi.string().trim(true).min(2).max(30).required(),
    email: Joi.string()
      .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      .trim(true)
      .required(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .required(),
  });
  return schema.validate(obj);
}

function validateLogin(obj) {
  const schema = Joi.object({
    email: Joi.string()
      .pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      .trim(true)
      .required(),
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .required(),
  });
  return schema.validate(obj);
}

async function hashPassword(password) {
  try {
    const hashedPass = await bcrypt.hash(password, 10);
    return hashedPass;
  } catch (err) {
    console.log(err.message);
  }
}

function checkPost(req, res, next) {
  if (req.method !== "POST")
    return res.status(405).send("Method is not allowed");
  next();
}

function checkIdRoute(req, res, next, id) {
  if (req.method === "POST")
    return res.status(405).send("Method is not allowed");
  if (isValidObjectId(id)) return next();
  res.status(422).send(`${id} is not a valid ObjectId`);
}

function checkMainRoute(req, res, next) {
  if (req.method === "DELETE" || req.method === "PUT")
    return res.status(405).send("Method is not allowed");
  next();
}

module.exports.validateGenre = validateGenre;
module.exports.validateCustomer = validateCustomer;
module.exports.validateMovie = validateMovie;
module.exports.validateRental = validateRental;
module.exports.validateUser = validateUser;
module.exports.hashPassword = hashPassword;
module.exports.validateLogin = validateLogin;
module.exports.checkPost = checkPost;
module.exports.checkIdRoute = checkIdRoute;
module.exports.checkMainRoute = checkMainRoute;
