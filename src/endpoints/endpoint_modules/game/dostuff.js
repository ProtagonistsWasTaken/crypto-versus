const { User } = require("../../../database/mongodb");
const { sendError, Errors } = require("../../../miscellaneous/error");
const { Post } = require("@protagonists/https");

module.exports = {
  urls: [ "api/dostuff" ],
  run: async function(req, res, data) {
    const user = User.findOne({ token: data.token });

    if(!user) return sendError(res, Errors.invalid.token());

    const response = await Post({ host: data.eventDomain }, "Ping!");

    if(response.err) return sendError(res, Errors.callback.unreachable());

    if(response.status.code != 200)
      return sendError(res, Errors.callback.failure());

    res.end(`Successfully did stuff as ${user.username}`);
  },
  method:'POST'
}
