const { Tokens } = require("./token_handler.js");
const { Salt, User } = require("../database/schemas.js");

function getToken(res, tokenString) {
  var token = Tokens.findOne({value: tokenString});
  if(!tokenString) {
    res.setHeader("status", "Missing token.");
    res.statusCode = 400;
    res.end("Token is required.");
    return undefined;
  }
  else if(token === null) {
    res.setHeader("status", "Invalid token.");
    res.statusCode = 403;
    res.end("Token is invalid.");
    return undefined;
  }
  else return token;
}

function validateUser(res, data) {
  // dont allow request if they didnt specify username and password
  if(!data.username || !data.password) {
    res.setHeader("status", "Missing data for account creation.");
    res.statusCode = 400;
    res.end(`${data.username ? "password" : "username"} is required.`);
    return false;
  }
  else if(typeof data.username != "string" || typeof data.password != "string") {
    res.setHeader("status", "Invalid data for account creation.");
    res.statusCode = 417;
    res.end(`Unexpected type for ${typeof data.username != "string" ? "username" : "password"}.\nExpected String.`);
    return false;
  }
  else
  {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.+<>(){}[]|:;~/\\'\"";
    for(let i = 0; i < data.username.length; i++)
      if(!chars.includes(data.username[i].toUpperCase())) {
        res.setHeader("status", "Illegal character.");
        res.statusCode = 400;
        res.end(`Username contains the following illegal character: "${data.username[i]}"`);
        return false;
      }
    for(let i = 0; i < data.password.length; i++)
      if(!chars.includes(data.password[i].toUpperCase())) {
        res.setHeader("status", "Illegal character.");
        res.statusCode = 400;
        res.end(`Password contains the following illegal character: "${data.password[i]}"`);
        return false;
      }

    if(data.username.length < 1 || data.username.length > 30 || data.password.length < 1 || data.password.length > 30) {
      res.setHeader("status", "Invalid length");
      res.statusCode = 400;
      res.end("Username and password must have a length of 1 to 30 characters.");
      return false;
    }

    return true;
  }
}

async function getUser(res, data) {
  var salt = await Salt.find();
  var password = await bcrypt.hash(data.password, salt[0].val);
  return await User.findOne({username: data.username});
}

module.exports = { getToken, validateUser }