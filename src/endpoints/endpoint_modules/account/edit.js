const Schema = require("@protagonists/coerce/coerce/Schema/Schema");
const bcrypt = require("bcryptjs");
const { Salt, User, editOptions } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous/error");

module.exports = {
  urls: [ "api/edit-account", "api/account/edit" ],
  run: async function(req, res, data) {
    // Make sure all data is valid
    try {
      data = editOptions(data);
    }
    catch(e) {
      res.statusCode = 400;
      res.end(e.message);
    }
    
    // Get the salt
    const salt = await Salt.findOne();
    // Get the user
    const user = await User.findOne({ token: data.token });

    // Check if a user is not found
    if(!user) return sendError(res, Errors.invalid.token());

    // Check if token expired
    if(user.expire < Date.now()) return sendError(res, Errors.expired());

    if(data.err) return sendError(res, Errors.invalid.paramType(data.path.split('.').pop(), data.expected));

    // Change the values for user
    if(!data[Schema.isDefault].username) user.username = data.username;
    if(!data[Schema.isDefault].password) user.password = await bcrypt.hash(data.password, salt.value);
    if(!data[Schema.isDefault].keyEnabled) user.keyEnabled = data.keyEnabled;
    
    // Save changes
    await user.save();
      
    // Response headers
    res.setHeader("user", user.username);
    res.setHeader("keyEnabled", user.keyEnabled);

    // Response
    res.end("Account updated!");
  },
  method:'POST'
}