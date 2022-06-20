// this route handles all /login requests
const bcrypt = require("bcrypt");
const { Salt, User } = require("../../../database/mongodbSchemas");
const { generateToken, validateUserInfo, sendError, Errors } = require("../../../miscellaneous");

module.exports = {
  urls: [ "api/login", "api/signin", "api/sign-in",
  "api/account/login", "api/account/signin", "api/account/sign-in" ],
  run: async function(req, res, data) {
    // Login using credentials
    if(data.username && data.password) {
      // Validate user info
      if(!validateUserInfo(res, data)) return;

      // Get the salt
      const salt = await Salt.find();
      // Hash the password
      const password = await bcrypt.hash(data.password, salt[0].value);
      // Get the user
      const user = await User.findOne({username: data.username});

      // Check if the username or password is wrong
      if(user === null || user.password != password)
        return sendError(res, Errors.invalidCredentials);
      
      // Generate a token
      const token = generateToken(32);

      // Update token values for the user
      user.token.value = token;
      user.token.expire = Date.now() + 1000 * 60 * 10;

      // Save changes
      await user.save();

      // Response headers
      res.setHeader("user", user.username);
      res.setHeader("expire", user.token.expire);
      res.setHeader("key", user.key.enabled);

      // Response
      res.end(token);
    }
    // Login using api key
    else if(data.key) {

      // Get the salt
      const salt = await Salt.find();
      // Hash the key
      const key = await bcrypt.hash(data.key, salt[0].value);
      // Get the user
      const user = await User.findOne({ key: { value: key } });

      // Check if user is invalid
      if(user === null)
        sendError(res, Errors.invalid.credentials());
      // Check if this account does not have api key enabled
      else if(!user.key.enabled)
        sendError(res, Errors.apiKeyDisabled());
      else {
        // Generate a token
        const token = generateToken(32);

        // Update token values for the user
        user.token.value = token;
        user.token.expire = Date.now() + 1000 * 60 * 10;

        // Save changes
        await user.save();

        // Response headers
        res.setHeader("user", user.username);
        res.setHeader("expire", user.token.expire);
        res.setHeader("key", user.key.enabled);

        // Response
        res.end(token);
      }
    }
    else sendError(res, Errors.login());
  },
  method:'POST'
}
