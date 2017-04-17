const express = require("express");
const router = express.Router();
const usernameValidator = require("../public/js/usernameValidator");

const exp = module.exports = {
  router: router
};

function canHaveUserName(name, userList) {
  name = name.trim();
  if (usernameValidator(name)) {
    return "warning";
  }
  return userList.some(u => u.name === name) ? "danger" : "success";
}

router.get("/:name", function(req, res, next) {
  res.send(canHaveUserName(req.params.name, exp.db.users));
});
