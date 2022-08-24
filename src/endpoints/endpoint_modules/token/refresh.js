const { connectionData, User } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous");
const uuid = require("uuid");

module.exports = {
  urls: [ "api/refresh-token", "api/token/refresh", "api/refresh" ],
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

    // Generate new token
    const token = uuid.v4();

    // Update token values for user
    user.token = token;
    user.expire = Date.now() + 1000 * 60 * 5;

    // Save changes
    await user.save();

    // Response headers
    res.setHeader("user", user.username);
    res.setHeader("expire", user.expire.getTime());
    res.setHeader("lifetime", 1000 * 60 * 5);
    res.setHeader("keyEnabled", !!user.keyEnabled);
    res.setHeader("eventsEnabled", !!user.eventsEnabled);

    // Response
    res.end(token);
  },
  method:'POST'
}
