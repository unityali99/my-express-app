const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");

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
  if (req.url !== "/") return next();
  if (req.method === "DELETE" || req.method === "PUT")
    return res.status(405).send("Method is not allowed");
  next();
}

function auth(getAllowed) {
  return (req, res, next) => {
    if (req.method === "GET" && getAllowed) return next();
    const token = req.header("X-Auth-Token");
    if (!token) return res.status(401).send("Access Denied. No token provided");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(422).send("Invalid token provided");
    }
  };
}

module.exports.checkPost = checkPost;
module.exports.checkIdRoute = checkIdRoute;
module.exports.checkMainRoute = checkMainRoute;
module.exports.auth = auth;
