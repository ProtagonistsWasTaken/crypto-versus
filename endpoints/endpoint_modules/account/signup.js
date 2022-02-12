// this route handles all /signup requests
const bcrypt = require("bcrypt");
const { Salt, User } = require("../../../database/schemas.js");
const { Token, validateUserInfo, sendError } = require("../../../miscellaneous");

module.exports = {
  urls:["api/signup", "api/account/signup"],
  run: async function(req, res, data) {
    if(validateUserInfo(res, data)) {
      var salt = await Salt.find();
      var password = await bcrypt.hash(data.password, salt[0].val);
      var user = await User.findOne({username: data.username});

      if(user === null) {
        if(!!data.eventsEnabled && !data.eventDomain)
          return sendError(res, {code:400,
            message:"Invalid user info",
            body:"event domain is invalid"
          });
        
        // Create a new user
        user = new User({
          username: data.username,
          password: password,
          keyEnabled: !!data.keyEnabled,
          events:{
            enabled: !!data.events.enabled,
            ip: data.ip
          }
        });
        await user.save();

        // Generate a token
        var token = new Token(data.username, 32, 1200000);

        // Set headers
        res.setHeader("user", token.user);
        res.setHeader("expire", token.lifetime);
        res.setHeader("key", !!user.keyEnabled);
        res.setHeader("events", !!user.events.enabled);
        if(!!user.events.enabled)
          res.setHeader("ip", user.events.ip);
        res.end(token.value);
      }
      else sendError(res, {code:403,
        message:"Account already exists.",
        body:`${data.username} already exists.`
      });
    }
  },
  method:'POST'
}
