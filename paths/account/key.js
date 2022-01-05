const bcrypt = require("bcrypt");
const { Salt, User } = require("../../database/schemas.js");
const { Token, sendError } = require("../../miscellaneous");

module.exports = {
  urls:["api-key", "key", "api/key", "refresh-api-key", "refresh-key", "api/refresh-key"],
  run:async function(req, res, data) {
    var token = Token.fromString(res, data.token);

    if(token){
      var user = await User.findOne({username: token.user});

      if(user.keyEnabled) {
        var key = new Token(token.user, 32, 0);
        res.end(key.value);
        var salt = await Salt.find();
        var hashedKey = await bcrypt.hash(key.value, salt[0].val);
        user.key = hashedKey;
        await user.save();
      }
      else sendError(res, {code:403,
        message:"Api key disabled.",
        body:`${token.user} does not have key enabled.`
      });
    }
  },
  method:'POST'
}