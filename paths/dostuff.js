const { Token } = require("../miscellaneous/token_handler.js");

module.exports = {
  urls:["dostuff"],
  run:async function(req, res, data) {
    var token = Token.fromString(res, data.token);
    if(token) res.end(`Successfully did stuff as ${token.user}`);
  },
  method:'POST'
}
