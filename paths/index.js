// basically precompiled headers but javascript. import this to get all routes
module.exports = [
  require("./main.js"), 
  require("./account/signup.js"), 
  require("./account/login.js"), 
  require("./dostuff.js"),
  require("./token/refresh.js")
];
