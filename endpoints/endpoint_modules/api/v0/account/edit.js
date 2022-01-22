const bcrypt = require("bcrypt");
const { Salt, User } = require("../../../../../database/schemas.js");
const { Token, sendError } = require("../../../../../miscellaneous");

module.exports = {
  urls:["api/v0/edit-account", "api/v0/account/edit"],
  run:async function(req, res, data) {
    var token = Token.fromString(res, data.token);
    if(token) {
      var salt = await Salt.find();
      var user = await User.findOne({username: token.user});

      if((data.username && typeof data.username != "string") || (data.password && typeof data.password != "string")) {
        sendError(res, {code:417,
          message:"Invalid data for account editing.",
          body:`Unexpected type for ${data.username ? "username" : "password"}.\nExpected String.`
        });
        return;
      }
      else if(data.keyEnabled !== undefined && typeof data.keyEnabled != "boolean") {
        sendError(res, {code:417,
          message:"Invalid data for account editing.",
          body:"Unexpected type for keyEnabled.\nExpected Boolean."
        });
        return;
      }

      user.username = data.username ? data.username : user.username;
      user.password = data.password ? await bcrypt.hash(data.password, salt[0].val) : user.password;
      user.keyEnabled = data.keyEnabled !== undefined ? data.keyEnabled !== false : user.keyEnabled;
      await user.save();
      
      res.setHeader("user", user.username);
      res.setHeader("key", user.keyEnabled ? user.keyEnabled : false);
      res.end("Account updated!");
    }
  },
  method:'POST'
}