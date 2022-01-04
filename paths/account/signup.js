// this route handles all /signup requests
const bcrypt = require("bcrypt");
const { Salt, User } = require("../../database/schemas.js");
const { Token } = require("../../miscellaneous/token_handler.js");

module.exports = {
  name:"signup",
  run:async function(req, res, data) {
    // dont allow request if they didnt specify username and password
    if(!data.username || !data.password) {
      res.setHeader("status", "Missing data for account creation.");
      res.statusCode = 400;
      res.end(`${data.username ? "password" : "username"} is required.`);
    }
    else if(typeof data.username != "string" || typeof data.password != "string") {
      res.setHeader("status", "Invalid data for account creation.");
      res.statusCode = 417;
      res.end(`Unexpected type for ${typeof data.username != "string" ? "username" : "password"}.\nExpected String.`);
    }
    else {
      var salt = await Salt.find();
      var password = await bcrypt.hash(data.password, salt[0].val);
      var user = await User.findOne({username: data.username});
      if(user === null) {

        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.+<>(){}[]|:;~/\\'\"";
        for(let i = 0; i < data.username.length; i++)
          if(!chars.includes(data.username[i].toUpperCase()))
          {
            res.setHeader("status", "Illegal character.");
            res.statusCode = 400;
            res.end(`Username contains the following illegal character: "${data.username[i]}"`);
            return;
          }
        for(let i = 0; i < data.password.length; i++)
          if(!chars.includes(data.password[i].toUpperCase()))
          {
            res.setHeader("status", "Illegal character.");
            res.statusCode = 400;
            res.end(`Password contains the following illegal character: "${data.password[i]}"`);
            return;
          }

        if(data.username.length < 1 || data.username.length > 30 || data.password.length < 1 || data.password.length > 30) {
          res.setHeader("status", "Invalid length");
          res.statusCode = 400;
          res.end("Username and password must have a length of 1 to 30 characters.");
          return;
        }

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
