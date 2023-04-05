const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");

function checkPost(req, res, next) {
  if (req.method !== "POST")
    return res.status(405).send("Method is not allowed");
  next();
}

function checkIdRoute(req, res, next, id) {
  if (req.method !== "GET" && req.method !== "PUT" && req.method !== "DELETE")
    return res.status(405).send("Method is not allowed");
  if (isValidObjectId(id)) return next();
  res.status(422).send(`${id} is not a valid ObjectId`);
}

function checkMainRoute(req, res, next) {
  if (req.url !== "/") return next();
  if (req.method !== "GET" && req.method !== "POST")
    return res.status(405).send("Method is not allowed");
  next();
}

function auth(req, res, next) {
  const token = req.header("X-Auth-Token");
  if (!token) return res.status(401).send("Access Denied. No token provided");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(422).send("Invalid token provided");
  }
}

function isAdmin(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Access Denied");
  next();
}

module.exports.checkPost = checkPost;
module.exports.checkIdRoute = checkIdRoute;
module.exports.checkMainRoute = checkMainRoute;
module.exports.auth = auth;
module.exports.isAdmin = isAdmin;
