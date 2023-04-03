const { isValidObjectId } = require("mongoose");

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

module.exports.checkPost = checkPost;
module.exports.checkIdRoute = checkIdRoute;
module.exports.checkMainRoute = checkMainRoute;
