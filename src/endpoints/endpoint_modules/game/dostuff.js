const { connectionData, User } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous/error");
const { Post } = require("@protagonists/request")(false);

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
        if(!user) return resolve(sendError(res, Errors.invalid.token()));

        if(!user.eventsEnabled) return resolve(sendError(res, Errors.disabled.events()));

        // Max wait time of 10 seconds
        const timeout = setTimeout(() => {
          if(!res.writableEnded)
            return resolve(sendError(res, Errors.callback.timeout()));
        }, 10000);

        console.log("Call #1");

        Post({ host: user.eventDomain }, "Ping!").then(response => {

          console.log("Call #2");

          if(response.err) return resolve(sendError(res, Errors.callback.unreachable()));

          if(response.status.code != 200)
            return resolve(sendError(res, Errors.callback.failure()));

          // Response headers
          res.setHeader("user", user.username);

          res.end(`Successfully did stuff as ${user.username}`);

          // Clear timeout
          resolve(clearTimeout(timeout));
        });
      });
    });
  },
  method:'POST'
}
