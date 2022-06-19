const bcrypt = require("bcrypt");
const { Salt, User } = require("/src/database");
const { generateToken, sendError, Errors } = require("/src/miscellaneous");

module.exports = {
  urls:[ "api/key", "api/refresh-api-key", "api/refresh-key",
  "api/key/refresh", "api/api-key/refresh" ],
  run: async function(req, res, data) {
    // Get the user
    const user = await User.findOne({ token: { value: data.token } })

    // Check if token is invalid
    if(!user) return sendError(res, Errors.invalid.token());

    // Check if user has api key disabled
    if(!user.key.enabled)
      return sendError(res, Errors.apiKeyDisabled());

    // Create new key
    const key = generateToken(32);
    // Get the salt
    const salt = await Salt.find();
    // Hash the key
    const hashedKey = await bcrypt.hash(key.value, salt[0].val);

    // Update key values for the user
    user.key.value = hashedKey;
    await user.save();

    // Response
    res.end(key.value);
  },
  method:'POST'
}