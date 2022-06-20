// this route handles all /signup requests
const bcrypt = require("bcrypt");
const { Salt, User, userOptions } = require("../../../database");
const { generateToken, validateUserInfo, sendError, Errors } = require("../../../miscellaneous");

module.exports = {
  urls:[ "api/signup", "api/account/signup" ],
  run: async function(req, res, data) {

    // Validate user info
    if(!validateUserInfo(res, data)) return;

    // Get the salt
    const salt = await Salt.find();
    // Hash the password
    const password = await bcrypt.hash(data.password, salt[0].value);
    // Find the user corresponding to the username (if any)
    const user = await User.findOne({username: data.username});

    // Check if that username is not taken
    if(user === null) {
      // Generate a token
      const token = generateToken(32);

      // Create a new user
      user = new User(userOptions({
        username: data.username,
        password: password,
        key: {
          enabled: data.keyEnabled
        },
        token: {
          value: token,
          expire: Date.now() + 1000 * 60 * 20
        }
      }));
      await user.save();
        
      // Response headers
      res.setHeader("user", user.username);
      res.setHeader("expire", user.token.expire);
      res.setHeader("key", user.key.enabled);

      // Response
      res.end(token);
    }
    // Account name taken
    else sendError(res, Errors.unavailable.username(data.username));
  },
  method:'POST'
}
