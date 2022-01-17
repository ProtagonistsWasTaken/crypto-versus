// basically precompiled headers but javascript. import this to get import all routes
module.exports = [
  require("./api/v0/account/signup"),
  require("./api/v0/account/login"),
  require("./api/v0/account/edit"),
  require("./api/v0/account/delete"),
  require("./api/game/dostuff"),
  require("./api/v0/token/refresh"),
  require("./api/v0/account/key"),
];
