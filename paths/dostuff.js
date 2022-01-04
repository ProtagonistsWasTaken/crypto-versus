const { Tokens } = require("../miscellaneous/token_handler.js");

module.exports = {
  name:"dostuff",
  run:async function(req, res, data) {
    var filteredTokens = Tokens.value.filter(token => token.value == data.token);
    if(!data.token) {
      // 400 error if token is not found
      res.setHeader("status", "Missing token to do stuff.");
      res.statusCode = 400;
      res.end("Token is required.");
    }
    else if(filteredTokens.length === 0) {
      // 403 error if token is found but invalid
      res.setHeader("status", "Invalid token to do stuff.");
      res.statusCode = 403;
      res.end("Token is invalid.");
    }
    else
      res.end(`Successfully did stuff as ${filteredTokens[0].user}`);
  },
  method:'POST'
}
