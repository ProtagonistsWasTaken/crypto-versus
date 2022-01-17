// basically precompiled headers but javascript. import this to get import all routes
module.exports = [
  require("./main"), 
  require("./account/signup"), 
  require("./account/login"), 
  require("./account/edit"),
  require("./account/delete"),
  require("./dostuff"),
  require("./token/refresh"),
  require("./account/key"),
  require("./securitytxt")
];
