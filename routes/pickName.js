const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
  res.render("pickName", {
    title: "Pick a name"
  });
});

module.exports = router;
