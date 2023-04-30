const bcrypt = require("bcryptjs");
const { connectionData, Salt, User } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous");
const uuid = require("uuid");

module.exports = {
  urls:[ "api/key", "api/refresh-key", "api/key/refresh" ],
  run: async function(req, res, data) {
    // Make sure all data is valid
    try {
      data = connectionData(data);
    }
    catch(e) {
      res.statusCode = 400;
      res.end(e.message);
    }

    // Get the user
    const user = await User.findOne({ token: data.token });

    // Check if user is not found
    if(!user) return sendError(res, Errors.invalid.token());

    // Check if token expired
    if(user.expire < Date.now()) return sendError(res, Errors.expired());

    // Check if user has api key disabled
    if(!user.keyEnabled) return sendError(res, Errors.disabled.apiKey());

    // Create new key
    const key = uuid.v4();
    // Get the salt
    const salt = await Salt.findOne();
    // Hash the key
    const hashedKey = await bcrypt.hash(key, salt.value);

    // Update key values for the user
    user.key = hashedKey;
    await user.save();

    // Response headers
    res.setHeader("user", user.username);

    // Response
    res.end(key);
  },
  method:'POST'
}