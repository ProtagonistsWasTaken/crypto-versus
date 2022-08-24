// this route handles all /login requests
const bcrypt = require("bcrypt");
const { Salt, User } = require("../../../database/mongodb");
const { validateUserInfo, sendError, Errors } = require("../../../miscellaneous");
const uuid = require("uuid");

module.exports = {
  urls: [ "api/login", "api/signin", "api/sign-in",
  "api/account/login", "api/account/signin", "api/account/sign-in" ],
  run: async function(req, res, data) {
    // Login using credentials
    if(data.username && data.password) {
      // Validate user info
      if(!validateUserInfo(res, data)) return;

      // Get the salt
      const salt = await Salt.findOne();
      // Hash the password
      const password = await bcrypt.hash(data.password, salt.value);
      // Get the user
      const user = await User.findOne({username: data.username});

      // Check if the username or password is wrong
      if(user === null || user.password != password)
        return sendError(res, Errors.invalid.credentials());
      
      // Generate a token
      const token = uuid.v4();

      // Update token values for the user
      user.token = token;
      user.expire = Date.now() + 1000 * 60 * 10;

      // Save changes
      await user.save();

      // Response headers
      res.setHeader("user", user.username);
      res.setHeader("expire", user.expire.getTime());
      res.setHeader("lifetime", 1000 * 60 * 10);

      // Response
      res.end(token);
    }
    // Login using api key
    else if(data.key) {

      // Get the salt
      const salt = await Salt.findOne();
      // Hash the key
      const key = await bcrypt.hash(data.key, salt.value);
      // Get the user
      const user = await User.findOne({ key });

      // Check if user is invalid
      if(user === null)
        sendError(res, Errors.invalid.credentials());
      // Check if this account does not have api key enabled
      else if(!user.keyEnabled)
        sendError(res, Errors.disabled.apiKey());
      else {
        // Generate a token
        const token = uuid.v4();

        // Update token values for the user
        user.token = token;
        user.expire = Date.now() + 1000 * 60 * 10;

        // Save changes
        await user.save();

        // Response headers
        res.setHeader("user", user.username);
        res.setHeader("expire", user.expire.getTime());
        res.setHeader("lifetime", 1000 * 60 * 10);

        // Response
        res.end(token);
      }
    }
    else sendError(res, Errors.login());
  },
  method:'POST'
}
