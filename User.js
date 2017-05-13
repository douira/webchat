const User = module.exports = function(userName) {
  this.userName = userName;
  this.creationTime = new Date();
};