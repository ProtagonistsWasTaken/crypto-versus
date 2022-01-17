const { Tokens } = require("./token_handler.js");
const { Salt, User } = require("../database/schemas.js");
const { sendError } = require("./error.js");

function validateUserInfo(res, data) {
  // dont allow request if they didnt specify username and password
  if(!data.username || !data.password) {
    sendError(res, {code:400,
      message:"Missing data",
      body:`${data.username ? "Password" : "Username"} is required.`
    });
    return false;
  }
  else if(typeof data.username != "string" || typeof data.password != "string") {
    sendError(res, {code:417,
      message:"Invalid data",
      body:`Unexpected type for ${typeof data.username != "string" ? "username" : "password"}.\nExpected String.`
    });
    return false;
  }
  else
  {
    // list of allowed chars
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.+<>(){}[]|:;~/\\!?&$#*@";
    for(let i = 0; i < data.username.length; i++)
      if(!chars.includes(data.username[i].toUpperCase())) { // dont allow char if not in list
        sendError(res, {code:400,
          message:"Illegal character",
          body:`Username contains the following illegal character: "${data.username[i]}"`
        });
        return false;
      }
    for(let i = 0; i < data.password.length; i++)
      if(!chars.includes(data.password[i].toUpperCase())) {
        sendError(res, {code:400,
          message:"Illegal character",
          body:`Password contains the following illegal character: "${data.password[i]}"`
        });
        return false;
      }

    if(data.username.length < 1 || data.username.length > 30 || data.password.length < 1 || data.password.length > 30) {
      sendError(res, {code:400,
        message:"Invalid length",
        body:"Username and password must have a length of 1 to 30 characters."
      });
      return false;
    }

    return true;
  }
}

module.exports = { validateUserInfo }