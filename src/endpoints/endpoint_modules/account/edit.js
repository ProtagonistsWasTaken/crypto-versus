const bcrypt = require("bcrypt");
const { Salt, User, editData } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous/error");

module.exports = {
  urls: [ "api/edit-account", "api/account/edit" ],
  run: async function(req, res, data) {
    // Get the salt
    const salt = await Salt.findOne();
    // Get the user
    const user = await User.findOne({ token: data.token });

    // Check if a user is not found
    if(!user) return sendError(res, Errors.invalid.token());

    // Check if token expired
    if(user.expire < Date.now()) return sendError(res, Errors.expired());

    // Make sure all data is valid
    data = editData(data);

    if(data.err) return sendError(res, Errors.invalid.paramType(data.path.split('.').pop(), data.expected));

    // Change the values for user
    user.username = data.username ? data.username : user.username;
    user.password = data.password ? await bcrypt.hash(data.password, salt.value) : user.password;
    user.keyEnabled = data.keyEnabled !== undefined ? data.keyEnabled : user.keyEnabled;
    
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