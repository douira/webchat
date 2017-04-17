const express = require("express");
const router = express.Router();

const exp = module.exports = {
  router: router
};

function canHaveUserName(name, userList) {
  name = name.trim();
  return userList.some(u => u.name === name) ? "danger" : "success";
}

router.get("/:name", function(req, res, next) {
  res.send(canHaveUserName(req.params.name, exp.db.users));
});
