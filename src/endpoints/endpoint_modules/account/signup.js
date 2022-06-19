// this route handles all /signup requests
const bcrypt = require("bcrypt");
const { Salt, User } = require("/src/database/mongodbSchemas.js");
const userSchema = require("/src/database/schemas.js");
const { generateToken, validateUserInfo, sendError } = require("/src/miscellaneous");

module.exports = {
  urls:["api/signup", "api/account/signup"],
  run: async function(req, res, data) {
    if(validateUserInfo(res, data)) {
      const salt = await Salt.find();
      const password = await bcrypt.hash(data.password, salt[0].val);
      const user = await User.findOne({username: data.username});

      if(user === null) {
        // Generate a token
        const token = generateToken(32);

        // Create a new user
        user = new User(userSchema({
          username: data.username,
          password: password,
          key: {
            enabled: data.keyEnabled === "true"
          },
          token: {
            value: token,
            expire: Date.now() + 1000 * 60 * 20
          }
        }));
        await user.save();
        
        res.setHeader("user", user.username);
        res.setHeader("expire", user.token.expire);
        res.setHeader("key", user.key.enabled);
        res.end(token);
      }
      else sendError(res, {
        code: 403,
        message: "Account already exists.",
        body: `${data.username} already exists.`
      });
    }
  },
  method:'POST'
}
