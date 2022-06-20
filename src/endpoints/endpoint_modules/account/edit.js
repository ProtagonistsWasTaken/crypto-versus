const bcrypt = require("bcrypt");
const { Salt, User } = require("../../../database/mongodbSchemas.js");
const { sendError, Errors } = require("../../../miscellaneous/error");

module.exports = {
  urls: [ "api/edit-account", "api/account/edit" ],
  run: async function(req, res, data) {
    // Get the salt
    const salt = await Salt.find();
    // Get the user
    const user = User.findOne({ token: { value: data.token } });

    // Check if token is invalid
    if(!user) return sendError(res, Errors.invalid.token());

    // Make sure all data is valid
    if(data.username && typeof data.username != "string")
      return sendError(res, Errors.invalid.paramType("username", "string"));
    if(data.password && typeof data.password != "string")
      return sendError(res, Errors.invalid.paramType("password", "string"));
    if(data.keyEnabled !== undefined && typeof data.keyEnabled != "boolean")
      return sendError(res, Errors.invalid.paramType("keyEnabled", "boolean"));

    // Change the values for user
    user.username = data.username ? data.username : user.username;
    user.password = data.password ? await bcrypt.hash(data.password, salt[0].val) : user.password;
    user.key.enabled = data.keyEnabled !== undefined ? data.keyEnabled : user.key.enabled;
    
    // Save changes
    await user.save();
      
    // Response headers
    res.setHeader("user", user.username);
    res.setHeader("key", user.key.enabled);

    // Response
    res.end("Account updated!");
  },
  method:'POST'
}