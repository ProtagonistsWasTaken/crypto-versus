// this route handles all /signup requests
const bcrypt = require("bcrypt");
const { Salt, User, userOptions } = require("../../../database");
const { validateUserInfo, sendError, Errors } = require("../../../miscellaneous");
const uuid = require("uuid");

module.exports = {
  urls:[ "api/signup", "api/account/signup" ],
  run: async function(req, res, data) {

    // Validate user info
    if(!validateUserInfo(res, data)) return;

    // Get the salt
    const salt = await Salt.findOne();
    // Hash the password
    const password = await bcrypt.hash(data.password, salt.value);
    // Find the user corresponding to the username (if any)
    const user = await User.findOne({username: data.username});

    // Check if that username is not taken
    if(user === null) {
      // Generate a token
      const token = uuid.v4();

      // Create a new user
      const newUser = new User(userOptions({
        username: data.username,
        password: password,
        keyEnabled: data.keyEnabled === 'true',
        token, expire: Date.now() + 1000 * 60 * 20,
        eventDomain: data.eventDomain,
        eventsEnabled: !!data.eventDomain
      }));
      try { await newUser.save() }
      catch(e) { return sendError(res, Errors.database.duplicateUser(data.username)) }
        
      // Response headers
      res.setHeader("user", newUser.username);
      res.setHeader("expire", newUser.expire.getTime());
      res.setHeader("lifetime", 1000 * 60 * 20);
      res.setHeader("keyEnabled", !!newUser.keyEnabled);
      res.setHeader("eventsEnabled", newUser.eventDomain);

      // Response
      res.end(token);
    }
    // Account name taken
    else sendError(res, Errors.unavailable.username(data.username));
  },
  method:'POST'
}
