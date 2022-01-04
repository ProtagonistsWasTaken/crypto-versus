const { Tokens } = require("../miscellaneous/token_handler.js");

module.exports = {
  name:"dostuff",
  run:async function(req, res, data) {
    var token = Tokens.findOne({value: data.token})
    if(!data.token) {
      // 400 error if token is not found
      res.setHeader("status", "Missing token to do stuff.");
      res.statusCode = 400;
      res.end("Token is required.");
    }
    else if(token === null) {
      // 403 error if token is found but invalid
      res.setHeader("status", "Invalid token to do stuff.");
      res.statusCode = 403;
      res.end("Token is invalid.");
    }
    else
      res.end(`Successfully did stuff as ${token.user}`);
  },
  method:'POST'
}
