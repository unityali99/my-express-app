const Joi = require("joi");
const bcrypt = require("bcrypt");
const winston = require("winston");
const { MongoDB } = require("winston-mongodb");

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
    isAdmin: Joi.boolean().default(false),
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

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ dirname: "logs", filename: "error.log" }),
    new MongoDB({
      level: "error",
      db: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jemggly.mongodb.net/movies`,
      options: {
        useUnifiedTopology: true,
      },
      collection: "logs",
    }),
  ],
});

const transports = [
  new winston.transports.File({
    dirname: "logs",
    filename: "uncaughtErrors.log",
  }),
  new winston.transports.Console(),
];
// Gets called automatically when utils.js is loaded by node. No need to call in server.js
winston.createLogger({
  exceptionHandlers: transports,
  rejectionHandlers: transports,
  exitOnError: true,
});

module.exports.validateCustomer = validateCustomer;
module.exports.validateMovie = validateMovie;
module.exports.validateGenre = validateGenre;
module.exports.validateRental = validateRental;
module.exports.validateUser = validateUser;
module.exports.hashPassword = hashPassword;
module.exports.validateLogin = validateLogin;
module.exports.logger = logger;
