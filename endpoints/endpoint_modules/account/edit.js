const bcrypt = require("bcrypt");
const { Salt, User } = require("../../../database/schemas.js");
const { Token, Webhook, sendError } = require("../../../miscellaneous");

module.exports = {
  urls:["api/edit-account", "api/account/edit"],
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
      else if(data.events.enabled && !data.events.ip && !user.events.ip) {
        sendError(res, {code:417,
          message:"Invalid data for account editing.",
          body:"Cannot set events to true with a missing parameter ip"
        });
        return;
      }

      // Send events
      if(user.events && user.events.enabled)
        await Webhook.update(user);

      user.username = typeof data.username === "string" ? data.username : user.username;
      user.password = typeof data.password === "string" ? await bcrypt.hash(data.password, salt[0].val) : user.password;
      user.keyEnabled = !!data.keyEnabled || user.keyEnabled;
      user.events = user.events ? user.events : {};
      user.events.enabled = !!data.events.enabled || user.events.enabled;
      user.events.ip = data.events.ip ? data.events.ip : user.events.ip;
      await user.save();
      
      res.setHeader("user", user.username);
      res.setHeader("key", !!user.keyEnabled);
      res.setHeader("events", !!user.events.enabled);
      if(!!user.events.enabled)
        res.setHeader("ip", user.events.ip);
      res.end("Account updated!");
    }
  },
  method:'POST'
}