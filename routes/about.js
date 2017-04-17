const express = require("express");
const router = express.Router();

const exp = module.exports = {
  router: router
};

router.get("/", function(req, res, next) {
  res.render("about", {
    title: "About"
  });
});
