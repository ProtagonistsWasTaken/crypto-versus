const bcrypt = require("bcrypt");
const { Salt, User } = require("../../../database/mongodb");
const { sendError, Errors } = require("../../../miscellaneous");
const uuid = require("uuid");

module.exports = {
  urls:[ "api/key", "api/refresh-key", "api/key/refresh" ],
  run: async function(req, res, data) {
    // Get the user
    const user = await User.findOne({ token: data.token });

    // Check if user is not found
    if(!user) return sendError(res, Errors.invalid.token());

    // Check if token expired
    if(user.expire < Date.now()) return sendError(res, Errors.expired());

    // Check if user has api key disabled
    if(!user.keyEnabled) return sendError(res, Errors.apiKeyDisabled());

    // Create new key
    const key = uuid.v4();
    // Get the salt
    const salt = await Salt.findOne();
    // Hash the key
    const hashedKey = await bcrypt.hash(key, salt.value);

    // Update key values for the user
    user.key = hashedKey;
    await user.save();

    // Response
    res.end(key);
  },
  method:'POST'
}