const express = require("express");
const router = express.Router();

const exp = module.exports = {
  router: router
};

//simply render about page
router.get("/", function(req, res, next) {
  res.render("about", {
    title: "About"
  });
});
