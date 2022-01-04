const { Tokens } = require("../../miscellaneous/token_handler.js");

module.exports = {
  name:"refresh-token",
  run:async function(req, res, data) {
    var filteredTokens = Tokens.value.filter(token => token.value == data.token);
    if(!data.token) {
      res.setHeader("status", "Missing token for refresh.");
      res.statusCode = 400;
      res.end("Token is required.");
    }
    else if(filteredTokens.length === 0) {
      res.setHeader("status", "Invalid token for refresh.");
      res.statusCode = 403;
      res.end("Token is invalid.");
    }
    else
      res.end(filteredTokens[0].refresh().value);
  },
  method:'POST'
}
