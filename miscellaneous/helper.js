const { sendError } = require("./error.js");
const fs = require("fs");
const path = require("path")

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
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.+<>(){}[]|:;~!?&$#";
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

// broken atm. 
function findFile(root=__dirname, name, req, res, data,  targetExtension = "") {
  try {
    // try to send file with the same name as the request
    res.end(fs.readFileSync(path.join(__dirname, root, name)));
  } catch (e) {
    try {
      // try to send file with the same name as the request but with .html extension
      res.end(fs.readFileSync(path.join(__dirname, root, name) + targetExtension));

    } catch (e) {
      sendError(res, {code:404,
        message:"Not found.",
        body:"This file is not available / not found"
      })
    }

  }
}

module.exports = { validateUserInfo, findFile }