const { connectionData, User } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous/error");

module.exports = {
  urls: [ "api/events/*" ],
  run: async function(req, res) {
    const token = req.url.split('/').pop();

    // Get the user
    const user = await User.findOne({ token });

    // Check if user is not found
    if(!user) return sendError(res, Errors.invalid.token());

    // Check if token expired
    if(user.expire < Date.now()) return sendError(res, Errors.expired());

    // Return data
    if(user.ping) {
      user.ping = false;
      await user.save();
      res.end("Ping!");
    }
    else res.end();
  },
  method: 'GET'
}
