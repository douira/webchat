const express = require("express");
const router = express.Router();

const exp = module.exports = {
  router: router
};

/*const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vel facilisis nisl, eu porta ex. Cras sit amet lacus pretium, ornare augue ac, laoreet metus. Duis eleifend rhoncus nisl, vitae mollis ipsum efficitur et. Curabitur turpis neque, mattis eu tincidunt ut, pretium quis felis. Pellentesque maximus vehicula dui, in consectetur risus ultrices eu. Sed finibus lacinia quam a auctor. Suspendisse non blandit justo. Praesent eu lorem sed lorem ullamcorper consectetur ac vel lectus. Quisque varius massa id semper venenatis. Etiam vehicula quam in quam sollicitudin maximus. Vestibulum eu blandit nisl. Integer eget mattis dolor, et imperdiet libero. Fusce eu diam quis mi posuere egestas pretium a mauris. Praesent molestie fringilla augue, vitae molestie massa varius eu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque sit amet molestie augue. In fermentum nisl nunc, vitae lacinia felis convallis eget. Phasellus mi leo, pretium in efficitur quis, eleifend in est. Pellentesque rhoncus lorem non nisi finibus rhoncus. Integer sed ligula id mauris fermentum mollis eget sed odio. Nunc nibh enim, viverra et nulla ut, euismod tempus dolor. Mauris volutpat pulvinar est, quis viverra felis pellentesque eu. Donec gravida justo quis diam finibus, vel malesuada lorem ultrices. Etiam sit amet felis.";

const messages = Array(40).fill(0).map(() => {
  const start = Math.floor(Math.random() * text.length / 2);
  const end = Math.floor(Math.random() * (text.length - start) + start);
  const nameLength = Math.floor(Math.random() * 4) + 5;
  const namePos = Math.floor(Math.random() * (text.length - nameLength));
  return {
    text: text.substring(start, end).trim(),
    author: text.substr(namePos, nameLength).trim(),
    time: new Date(Math.round(Math.random() * Date.now()))
  };
});*/

//get request to main page
router.get("/", function(req, res, next) {
  //get session
  const sess = req.session;
  console.log("get chat", req.session);
  console.log(exp.db.getSet("users").getArray());

  //data passed to renderer
  const data = {
    messages: exp.db.getSet("messages").getData()
  };

  //render error if name was registered incorrectly
  if (sess.nameError) {
    //error title and error message concerning user name
    data.title = "webchat error";
    data.errorMessage = "user name error: " + sess.nameError;
  } //render with user name if set, otherwise default to page for new users
  else if (sess.userName) {
    //set title to include user name and set user name to display input box
    data.title = "webchat @" + sess.userName;
    data.userName = sess.userName;
  }

  //render with template and modified data
  res.render("chat", data);
});
