// this route handles all /delete requests
const { User } = require("../../../database/mongodbSchemas.js");
const { sendError, Errors } =  require("../../../miscellaneous/error");

module.exports = {
  urls: [ "api/delete-account", "api/account/delete" ],
  run: async function(req, res, data) {
    // Get the user
    const user = User.findOne({ token: { value: data.token } });
    
    // Check if token is invalid
    if(!user) return sendError(res, Errors.invalid.token());

    // Delete the user
    await user.delete();

    // Response
    res.end("Account deleted successfully!");
  },
  method:'POST'
}
