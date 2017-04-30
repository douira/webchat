const express = require("express");
const router = express.Router();
const usernameValidator = require("../public/js/usernameValidator");
const inspect = require("util").inspect;

const exp = module.exports = {
  router: router
};

//post to this endpoint checks and then registers the given user name
router.post("/", function(req, res, next) {
  //get session object
  const sess = req.session;

  //make new session for reset of user
  sess.regenerate((err) => {
    //if creating the session went ok
    if (! err) {
      //get user name from post request
      const userName = req.body.name;

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
      }

      //save the created session
      sess.save();
    }
  });
});