const { connectionData, User } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous");

module.exports = {
  urls: [ "api/account/info", "api/account-info" ],
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

    // Return data
    res.end(JSON.stringify({
      user: user.username,
      expire: user.expire,
      keyEnabled: user.keyEnabled,
      eventDomain: user.eventDomain,
      eventsEnabled: user.eventsEnabled
    }));
  },
  method: "POST"
}
