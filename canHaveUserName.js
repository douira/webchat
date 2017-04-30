//used to validate the name itself
const usernameValidator = require("./public/js/usernameValidator");

//checks if a user name is already in the user name databse and respons with according state names
module.exports = function canHaveUserName(name, userList) {
  //name must be a string
  if (typeof name !== "string") {
    return "danger";
  }

  //clean up and check name itself
  name = name.trim();
  if (usernameValidator(name)) {
    return "warning";
  }

  //if name itself ok check it already taken by another user
  return userList.some(u => u.name === name) ? "danger" : "success";
};