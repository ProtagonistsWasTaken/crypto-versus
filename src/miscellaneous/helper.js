const { sendError, Errors } = require("./error.js");
const fs = require("fs");
const path = require("path")

function validateUserInfo(res, data) {
  // dont allow request if they didnt specify username or password
  if(!data.username || !data.password)
    return sendError(res, Errors.missingParam(data.username ? "Password" : "Username")) && false;
  
  // Check if type matches (because of json convertion)
  if(typeof data.username !== "string")
    return sendError(res, Errors.invalid.paramType("username", "string")) && false;
  if(typeof data.password !== "string")
    return sendError(res, Errors.invalid.paramType("password", "string")) && false;

  // Validate the parameters
  const nameChar = illegalChar(data.username);

  if(nameChar) return sendError(res, Errors.illegal.username(nameChar)) && false;

  const passChar = illegalChar(data.password);

  if(passChar) return sendError(res, Errors.illegal.password(passChar)) && false;

  if(data.username.length < 1 || data.username.length > 32 ||
    data.password.length < 1 || data.password.length > 32)
    return sendError(res, Errors.credentialsLength()) && false;

  return true;
}

function illegalChar(str) {
  // list of allowed chars
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.+<>(){}[]|:;~!?&$#";

  for(let i = 0; i < str.length; i++)
    if(!chars.includes(str[i].toUpperCase()))
      return str[i];
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
      sendError(res, {
        code: 404,
        message: "Not found.",
        body: "This file is not available / not found"
      })
    }

  }
}

module.exports = { validateUserInfo, findFile }