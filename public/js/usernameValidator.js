module.exports = function(name) {
  if (name.length >= 20) {
    return "name must be less than 20 characters long.";
  } else if (name.length < 2) {
    return "name must be at least two characters long.";
  } else {
    var matches = name.match(/[a-zA-z0-9]/g);
    return matches && matches.join("") === name ? false : "name can only include alphanumeric characters.";
  }
};
