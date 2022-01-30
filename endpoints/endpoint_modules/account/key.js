const bcrypt = require("bcrypt");
const { Salt, User } = require("../../../database/schemas.js");
const { Token, sendError } = require("../../../miscellaneous");

module.exports = {
  urls:["api/key", "api/refresh-api-key", "api/refresh-key", "api/key/refresh", "api/api-key/refresh"],
  run:async function(req, res, data) {
    const token = Token.fromString(res, data.token);

    if(token){
      const user = await User.findOne({username: token.user});

      if(user.keyEnabled) {
        const key = new Token(token.user, 32, 0);
        const salt = await Salt.find();
        const hashedKey = await bcrypt.hash(key.value, salt[0].val);
        user.key = hashedKey;
        await user.save();
        res.end(key.value);
      }
      else sendError(res, {code:403,
        message:"Api key disabled.",
        body:`${token.user} does not have key enabled.`
      });
    }
  },
  method:'POST'
}