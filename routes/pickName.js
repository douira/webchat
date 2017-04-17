const express = require("express");
const router = express.Router();

const exports = module.exports = {
  router: router
};

router.get("/", function(req, res, next) {
  res.render("pickName", {
    title: "Pick a name"
  });
});
