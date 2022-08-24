const { connectionData, User } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous/error");
const { Post } = require("@protagonists/request")();

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

    const user = User.findOne({ token: data.token });

    if(!user) return sendError(res, Errors.invalid.token());

    if(!user.eventsEnabled) return sendError(res, Errors.disabled.events());

    const response = await Post({ host: user.eventDomain }, "Ping!");

    if(response.err) return sendError(res, Errors.callback.unreachable());

    if(response.status.code != 200)
      return sendError(res, Errors.callback.failure());

    // Response headers
    res.setHeader("user", user.username);
    res.setHeader("keyEnabled", user.keyEnabled);
    res.setHeader("eventsEnabled", user.eventsEnabled);

    res.end(`Successfully did stuff as ${user.username}`);
  },
  method:'POST'
}
