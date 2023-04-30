const { Schema } = require("@protagonists/coerce");
const { callbackData, User } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous/error");

module.exports = {
  urls: [ "api/dostuff" ],
  run: async function(req, res, data) {
    // Make sure all data is valid
    try {
      data = callbackData(data);
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

    // Get the target
    let target = user;
    if(!data[Schema.isDefault].target)
      target = await User.findOne({ username: data.target });
    
    if(!target) return sendError(res, Errors.callback.inexistantTarget());

    // Make changes
    target.ping = true;
    await target.save();

    // Response headers
    res.setHeader("user", user.username);

    // Response
    res.end(`Successfully did stuff as ${user.username}`);
  },
  method:'POST'
}
