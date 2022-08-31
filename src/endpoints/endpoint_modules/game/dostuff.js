const { connectionData, User } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous/error");

module.exports = {
  urls: [ "api/dostuff" ],
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
    user = await User.findOne({ token: data.token });

    // Check if user is not found
    if(!user) return sendError(res, Errors.invalid.token());

    // Check if token is expired
    if(!user.eventsEnabled) return sendError(res, Errors.disabled.events());

    // Make changes
    user.ping = true;
    await user.save();

    // Response headers
    res.setHeader("user", user.username);

    // Response
    res.end(`Successfully did stuff as ${user.username}`);
  },
  method:'POST'
}
