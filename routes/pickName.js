const express = require("express");
const router = express.Router();

const exp = module.exports = {
  router: router
};

//display pick name page
router.get("/", function(req, res, next) {
  res.render("pickName", {
    title: "Pick a user name"
  });
});
