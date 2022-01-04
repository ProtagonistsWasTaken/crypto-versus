const { Tokens } = require("../../miscellaneous/token_handler.js");

module.exports = {
  name:"refresh-token",
  run:async function(req, res, data) {
    var token = Tokens.findOne({value: data.token});
    if(!data.token) {
      res.setHeader("status", "Missing token for refresh.");
      res.statusCode = 400;
      res.end("Token is required.");
    }
    else if(token === null) {
      res.setHeader("status", "Invalid token for refresh.");
      res.statusCode = 403;
      res.end("Token is invalid.");
    }
    else
      res.end(token.refresh().value);
  },
  method:'POST'
}
