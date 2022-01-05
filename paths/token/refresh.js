const { Token } = require("../../miscellaneous/token_handler.js");

module.exports = {
  urls:["refresh-token"],
  run:async function(req, res, data) {
    var token = Token.fromString(res, data.token);
    if(token) res.end(token.refresh().value);
  },
  method:'POST'
}
