const express = require("express");
const router = express.Router();
const usernameValidator = require("../public/js/usernameValidator");
const inspect = require("util").inspect;

const exp = module.exports = {
  router: router
};

router.post("/", function(req, res, next) {
  const sess = req.session;
  sess.regenerate((err) => {
    if (! err) {
      console.log("post", req.session);
      const userName = req.body.name;
      const validationResponse = usernameValidator(userName);
      if (validationResponse) {
        sess.userName = false;
        sess.nameError = validationResponse;
      } else {
        sess.userName = userName;
        sess.nameError = false;
      }
      sess.save();
    }
  });
});