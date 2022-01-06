// this route handles all /login requests
const bcrypt = require("bcrypt");
const { Salt, User } = require("../../database/schemas.js");
const { Token, Tokens, validateUserInfo, sendError } = require("../../miscellaneous");

module.exports = {
  urls:["login","signin","sign-in", "account/login", "account/signin", "account/sign-in"],
  run:async function(req, res, data) {
    // Login using creditentials
    if(data.username && data.password) {
      if(validateUserInfo(res, data)) {

        var salt = await Salt.find();
        var password = await bcrypt.hash(data.password, salt[0].val);
        var user = await User.findOne({username: data.username});

        if(user === null) sendError(res, {code:401,
          message:"Account not found.",
          body:`${data.username} doesn't exists.`
        });
        else if(user.password != password) sendError(res, {code:403,
          message:"Login unsuccessful.",
          body:"Invalid password."
        });
        else {
          // Invalidate previous tokens (if any)
          var token = Tokens.findOne({user: data.username});
          if(token !== null) token.invalidate();
          // Generate a token
          var newToken = new Token(data.username, 32, 600000);
          res.setHeader("user", newToken.user);
          res.setHeader("expire", newToken.lifetime);
          res.setHeader("key", user.keyEnabled ? user.keyEnabled : false);
          res.end(newToken.value);
        }
      }
    }
    // Login using api key
    else if(data.key) {
      var salt = await Salt.find();
      var key = await bcrypt.hash(data.key, salt[0].val);
      var user = await User.findOne({key});
      
      if(user === null) sendError(res, {code:401,
        message:"Account not found.",
        body:`${data.username} doesn't exists.`
      });
      else if(!user.keyEnabled) sendError(res, {code:403,
        message:"Api key disabled.",
        body:`${user.username} does not have key enabled.`
      });
      else {
        // Invalidate previous tokens (if any)
        var token = Tokens.findOne({user: user.username});
        if(token !== null) token.invalidate();

        // Generate a token
        var newToken = new Token(user.username, 32, 600000);
        res.setHeader("user", newToken.user);
        res.setHeader("expire", newToken.lifetime);
        res.setHeader("key", user.keyEnabled ? user.keyEnabled : false);
        res.end(newToken.value);
      }
    }
    else sendError(res, {code:400,
      message:"Login unsuccessful.",
      body:"Missing login info."
    });
  },
  method:'POST'
}
