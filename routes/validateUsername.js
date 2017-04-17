const express = require("express");
const router = express.Router();

const exports = module.exports = {
  router: router
};

router.get("/:name", function(req, res, next) {
  res.send(req.params.name + " " + router.db.users[0]);
});
