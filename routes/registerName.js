const express = require("express");
const router = express.Router();
const usernameValidator = require("../public/js/usernameValidator");
const User = require("../User.js");

const exp = module.exports = {
  router: router
};

//post to this endpoint checks and then registers the given user name
router.post("/", function(req, res, next) {
  //get session object
  const sess = req.session;
  console.log("register, before regen", sess);
  //make new session for reset of user
  sess.regenerate((err) => {
    //if creating the session went ok
    if (! err) {
      //get user name from post request
      const userName = req.body.name;
      console.log("register, after regen", sess);
      //check if user name if ok and isn't taken yet
      const validationResponse = usernameValidator(userName);
      if (validationResponse) {
        //no user name but error message
        sess.userName = false;
        sess.nameError = validationResponse;
      } else {
        //given user name and no error message
        sess.userName = userName;
        sess.nameError = false;

        //add name to database
        exp.db.getSet("users").setEntry(userName, new User(userName));
      }

      //save the created session
      sess.save();

      //send something back to make the client js trigger the redirect
      res.send("acc");
    }
  });
});