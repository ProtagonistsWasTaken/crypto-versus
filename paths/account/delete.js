const { Tokens } = require("../../miscellaneous/token_handler.js");
const { User } = require("../../database/schemes.js")

module.exports = {
  name:"delete-account",
  run:async function(req, res, data) {
    var filteredTokens = Tokens.value.filter(token => token.value == data.token);
    
    // error if token is missing.
    if(!data.token) {
      res.setHeader("status", "Missing token to do stuff.");
      res.statusCode = 400; 
      res.end("Token is required.");
    }

    // error if token is found but not valid.
    else if(filteredTokens.length === 0) { 
      res.setHeader("status", "Invalid token to do stuff.");
      res.statusCode = 403;
      res.end("Token is invalid.");
    }
    else {
      User.deleteOne({username: filteredTokens[0].user}, err=>{
        if(err !== null) {
          res.setHeader("status", "Database error.");
          res.statusCode = 500;
          res.end(`Could not delete ${filteredTokens[0].user}`);
        }
        else {
          
        }
      });
    }
  },
  method:'POST'
}