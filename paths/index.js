// basically precompiled headers but javascript. import this to get import all routes
module.exports = [
  require("./main.js"), 
  require("./account/signup.js"), 
  require("./account/login.js"), 
  require("./account/edit.js"),
  require("./account/delete.js"),
  require("./dostuff.js"),
  require("./token/refresh.js")
];
