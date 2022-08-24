const bcrypt = require("bcrypt");
const { Salt, User, editData } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous/error");

module.exports = {
  urls: [ "api/edit-account", "api/account/edit" ],
  run: async function(req, res, data) {
    // Make sure all data is valid
    try {
      data = editData(data);
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
    if(data.username) user.username = data.username;
    if(data.password) user.password = await bcrypt.hash(data.password, salt.value);
    if(data.keyEnabled !== undefined) user.keyEnabled = data.keyEnabled === 'true';
    if(data.eventDomain) user.eventDomain = data.eventDomain;
    if(data.eventsEnabled !== undefined) user.eventsEnabled = data.eventsEnabled === 'true';
    
    // Save changes
    await user.save();
      
    // Response headers
    res.setHeader("user", user.username);
    res.setHeader("keyEnabled", newUser.keyEnabled === 'true');
    res.setHeader("eventsEnabled", !!user.eventDomain);

    // Response
    res.end("Account updated!");
  },
  method:'POST'
}