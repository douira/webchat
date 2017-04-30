const express = require("express");
const router = express.Router();
const canHaveUserName = require("../canHaveUserName");

const exp = module.exports = {
  router: router
};

router.get("/:name", function(req, res, next) {
  res.send(canHaveUserName(req.params.name, exp.db.users));
});
