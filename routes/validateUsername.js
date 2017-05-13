const express = require("express");
const router = express.Router();
const canHaveUserName = require("../canHaveUserName");

const exp = module.exports = {
  router: router
};

//respond with validation response state name
router.get("/:name", function(req, res, next) {
  res.send(canHaveUserName(req.params.name, exp.db.getSet("users").getArray()));
});
