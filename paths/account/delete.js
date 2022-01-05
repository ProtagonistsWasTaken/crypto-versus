// this route handles all /delete requests
const { User } = require("../../database/schemas.js");
const { Tokens } = require("../../miscellaneous/token_handler.js")

module.exports = {
  name:"delete-account",
  run:async function(req, res, data) {
    var token = Tokens.findOne({value: data.token});
    // error if token is missing.
    if(!data.token) {
      res.setHeader("status", "Missing token for refresh.");
      res.statusCode = 400;
      res.end("Token is required.");
    }
    // error if token is found but not valid.
    else if(token === null) {
      res.setHeader("status", "Invalid token for refresh.");
      res.statusCode = 403;
      res.end("Token is invalid.");
    }
    else
      var result = await User.deleteOne({username: token.user});
      if(!result.deletedCount) {
        res.setHeader("status", "Database error.");
        res.statusCode = 500;
        res.end(`Could not delete ${token.user}`);
      }
      else {
        token.invalidate();
        res.end(`${token.user} deleted successfully!`);
      }
  },
  method:'POST'
}
