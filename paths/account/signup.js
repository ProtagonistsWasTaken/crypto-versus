// this route handles all /signup requests
const bcrypt = require("bcrypt");
const { Salt, User } = require("../../database/schemas.js");
const { Token, validateUserInfo, sendError } = require("../../miscellaneous");

module.exports = {
  urls:["signup", "account/signup"],
  run: async function(req, res, data) {
    if(validateUserInfo(res, data)) {
      var salt = await Salt.find();
      var password = await bcrypt.hash(data.password, salt[0].val);
      var user = await User.findOne({username: data.username});

      if(user === null) {
        // Create a new user
        user = new User({
          username: data.username,
          password: password,
          keyEnabled: data.keyEnabled !== undefined ? data.keyEnabled : false
        }).save();

        // Generate a token
        var token = new Token(data.username, 32, 1200000);
        res.setHeader("user", token.user);
        res.setHeader("expire", token.lifetime);
        res.setHeader("keyEnabled", user.keyEnabled);
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
