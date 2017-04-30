//is a node module but is also used by frontend  by supplying a fake module.exports
//checks the given name for validity
module.exports = function(name) {
  //name must be string
  if (! typeof name === "string") {
    return "name is invalid!";
  } //length requirements
  else if (name.length >= 20) {
    return "name must be less than 20 characters long.";
  } else if (name.length < 2) {
    return "name must be at least two characters long.";
  } //check chars in name
  else {
    var matches = name.match(/[a-zA-z0-9]/g);
    return matches && matches.join("") === name ? false : "name can only include alphanumeric characters.";
  }
};
