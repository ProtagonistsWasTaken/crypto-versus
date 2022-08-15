// this route handles all /delete requests
const { User } = require("../../../database/mongodb.js");
const { sendError, Errors } =  require("../../../miscellaneous/error");

module.exports = {
  urls: [ "api/delete-account", "api/account/delete" ],
  run: async function(req, res, data) {
    // Get the user
    const user = await User.findOne({ token: data.token });
    
    // Check if user is not found
    if(!user) return sendError(res, Errors.invalid.token());

    // Check if token expired
    if(user.expire < Date.now()) return sendError(res, Errors.expired());

    // Delete the user
    const d = await User.deleteOne(user);
    
    if(d.acknowledged && d.deletedCount == 1)
      res.end("Account deleted successfully!");
    else sendError(res, Errors.database.inexistantUser());
  },
  method:'POST'
}
