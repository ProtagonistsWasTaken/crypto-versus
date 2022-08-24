const { connectionData, User } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous/error");
const { Post } = require("@protagonists/request")();

module.exports = {
  urls: [ "api/dostuff" ],
  run: function(req, res, data) {
    return new Promise(resolve => {
      // Make sure all data is valid
    try {
      data = connectionData(data);
    }
    catch(e) {
      res.statusCode = 400;
      res.end(e.message);
    }

    User.findOne({ token: data.token }).then(user => {
      if(!user) resolve(sendError(res, Errors.invalid.token()));

      if(!user.eventsEnabled) return sendError(res, Errors.disabled.events());

      // Max wait time of 10 seconds
      const timeout = setTimeout(() => {
        if(!res.writableEnded)
          return sendError(res, Errors.callback.timeout());
      }, 10000);

      Post({ host: user.eventDomain }, "Ping!").then(response => {
        if(response.err) return sendError(res, Errors.callback.unreachable());

        if(response.status.code != 200)
          return sendError(res, Errors.callback.failure());

        // Clear timeout
        clearTimeout(timeout);

        // Response headers
        res.setHeader("user", user.username);
        res.setHeader("keyEnabled", !!user.keyEnabled);
        res.setHeader("eventsEnabled", !!user.eventsEnabled);

        res.end(`Successfully did stuff as ${user.username}`);
      });
    });
    });
  },
  method:'POST'
}
