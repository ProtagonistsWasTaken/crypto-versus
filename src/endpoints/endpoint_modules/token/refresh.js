const { User } = require("../../../database/mongodb");
const { sendError, Errors } = require("../../../miscellaneous");
const uuid = require("uuid");

module.exports = {
  urls: [ "api/refresh-token", "api/token/refresh", "api/refresh" ],
  run: async function(req, res, data) {
    // Get the user
    const user = await User.findOne({ token: data.token });

    // Check if user is not found
    if(!user) return sendError(res, Errors.invalid.token());

    // Check if token expired
    if(user.expire < Date.now()) return sendError(res, Errors.expired());

    // Generate new token
    const token = uuid.v4();

    // Update token values for user
    user.token = token;
    user.expire = Date.now() + 1000 * 60 * 5;

    // Save changes
    await user.save();

    // Response headers
    res.setHeader("user", user.username);
    res.setHeader("expire", user.expire);

    // Response
    res.end(token);
  },
  method:'POST'
}
