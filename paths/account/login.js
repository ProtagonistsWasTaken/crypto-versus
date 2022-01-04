// this route handles all /login requests
const bcrypt = require("bcrypt");
const { Salt, User } = require("../../database/schemes.js");
const { Token, Tokens } = require("../../miscellaneous/token_handler.js");

module.exports = {
  name:"login",
  run:async function(req, res, data) {
    // dont allow request if they didnt specify username and password
    if(!data.username || !data.password) {
      res.setHeader("status", "Missing data for login request.");
      res.statusCode = 400;
      res.end(`${data.username ? "password" : "username"} is required.`);
    }
    else if(typeof data.username != "string" || typeof data.password != "string") {
      res.setHeader("status", "Invalid data for login request.");
      res.statusCode = 417;
      res.end(`Unexpected type for ${typeof data.username != "string" ? "username" : "password"}.\nExpected String.`);
    }
    else {
      var salt = await Salt.find();
      var password = await bcrypt.hash(data.password, salt[0].val);
      var user = await User.findOne({username: data.username});
      if(user === null) {
        res.setHeader("status", "Account not found.");
        res.statusCode = 404;
        res.end(`${data.username} doesn't exists.`);
      }
      else if(user.password != password) {
        res.setHeader("status", "Login unsuccessful.");
        res.statusCode = 403;
        res.end("Invalid password.");
      }
      else {
        // Invalidate previous tokens (if any)
        var filteredTokens = Tokens.value.filter(token => token.user == data.username);
        if(filteredTokens.length > 0) filteredTokens[0].invalidate();
        // Generate a token
        var token = new Token(data.username, 32, 600000);
        res.setHeader("expire", token.lifetime);
        res.end(token.value);
      }
    }
  },
  method:'POST'
}
