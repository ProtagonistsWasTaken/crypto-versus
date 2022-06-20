const { User } = require("../../../database/mongodbSchemas");
const { sendError, Errors } = require("../../../miscellaneous/error");
const { Post } = require("@protagonists/https");

module.exports = {
  urls: [ "api/dostuff" ],
  run: async function(req, res, data) {
    const user = User.findOne({ token: { value: data.token } });

    if(!user) return sendError(res, Errors.invalid.token());

    const response = await Post({ host: data.ip + ":443" }, "Ping!");

    if(response.err) return sendError(res, Errors.callback.unreachable());

    if(response.status.code != 200)
      return sendError(res, Errors.callback.failure());

    res.end(`Successfully did stuff as ${user.username}`);
  },
  method:'POST'
}
