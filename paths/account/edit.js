const bcrypt = require("bcrypt");
const { Salt, User } = require("../../database/schemas.js");
const { getToken } = require("../../miscellaneous/helper.js");

module.exports = {
  urls:["edit-account"],
  run:async function(req, res, data) {
    var token = getToken(res, data.token);
    if(token) {
      var salt = await Salt.find();
      var user = await User.findOne({username: token.user});
      if((data.username && typeof data.username != "string") || (data.password && typeof data.password != "string")) {
        res.setHeader("status", "Invalid data for account creation.");
        res.statusCode = 417;
        res.end(`Unexpected type for ${data.username ? "username" : "password"}.\nExpected String.`);
        return;
      }
      user.username = data.username ? data.username : user.username;
      user.password = data.password ? await bcrypt.hash(data.password, salt[0].val) : user.password;
      user.save();
      res.end("Account updated!");
    }
  },
  method:'POST'
}