// this route handles all /signup requests
const bcrypt = require("bcrypt");
const { Salt, User } = require("../../database/schemas.js");
const { Token } = require("../../miscellaneous/token_handler.js");
const { validateUser } = require("../../miscellaneous/helper.js");

module.exports = {
  urls:["signup"],
  run: async function(req, res, data) {
    if(validateUser(res, data)) {
      
      if(user === null) {
        new User({
          username: data.username,
          password: password
        }).save();
        // Generate a token
        var token = new Token(data.username, 32, 1200000);
        res.setHeader("expire", token.lifetime);
        res.end(token.value);
      }
      else {
        res.setHeader("status", "Account already exists.");
        res.statusCode = 403;
        res.end(`"${data.username}" already exists.`);
      }
    }
  },
  method:'POST'
}
