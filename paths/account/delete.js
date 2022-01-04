<<<<<<< HEAD
const { Tokens } = require("../../miscellaneous/token_handler.js");
const { User } = require("../../database/schemes.js")
=======
// this route handles all /delete requests
const { User } = require("../../database/schemes.js");
const { Tokens } = require("../../miscellaneous/token_handler.js")
>>>>>>> origin/dev

module.exports = {
  name:"delete-account",
  run:async function(req, res, data) {
    var filteredTokens = Tokens.value.filter(token => token.value == data.token);
<<<<<<< HEAD
    
    // error if token is missing.
    if(!data.token) {
      res.setHeader("status", "Missing token to do stuff.");
      res.statusCode = 400; 
      res.end("Token is required.");
    }

    // error if token is found but not valid.
    else if(filteredTokens.length === 0) { 
      res.setHeader("status", "Invalid token to do stuff.");
=======
    if(!data.token) {
      res.setHeader("status", "Missing token for refresh.");
      res.statusCode = 400;
      res.end("Token is required.");
    }
    else if(filteredTokens.length === 0) {
      res.setHeader("status", "Invalid token for refresh.");
>>>>>>> origin/dev
      res.statusCode = 403;
      res.end("Token is invalid.");
    }
    else {
      User.deleteOne({username: filteredTokens[0].user}, err=>{
        if(err !== null) {
          res.setHeader("status", "Database error.");
          res.statusCode = 500;
<<<<<<< HEAD
          res.end(`Could not delete ${filteredTokens[0].user}`);
        }
        else {
          
=======
          res.end(`Could not delete ${filteredTokens[0]}`);
        }
        else {
          filteredTokens[0].invalidate();
          res.end(`${filteredTokens[0].user} deleted successfully!`);
>>>>>>> origin/dev
        }
      });
    }
  },
  method:'POST'
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/dev
