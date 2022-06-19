// Imports
const { Schema, SchemaTypes } = require("@protagonists/coerce");

// Create 'Options' Schema
const Options = new Schema({
  code: SchemaTypes.IntRange(100, 599),
  message: String,
  body: String
});
// Create placeholder values
Options.setDefaults({
  code: 500,
  message: "Unidentified error.",
  body: "An error occurred."
});

// Send an error to the response
function sendError(res, options){
  options = Options(options);

  res.statusCode = options.code;
  res.statusMessage = options.message;
  res.end(options.body);
}

const Errors = {
  missingParam: name => { return {
    code: 400,
    message: "Missing data",
    body: `${name} is required.`
  }},
  illegal: {
    username: char => { return {
      code: 400,
      message: "Illegal character",
      body: `Username contains the following illegal character: "${char}"`
    }},
    password: char => { return {
      code: 400,
      message: "Illegal character",
      body: `Password contains the following illegal character: "${char}"`
    }}
  },
  credentialsLength: () => { return {
    code: 400,
    message: "Invalid length",
    body: "Username and password must have a length of 1 to 32 characters."
  }},
  invalid: {
    credentials: () => { return {
      code: 403,
      message: "Login unsuccessful.",
      body: "Invalid credentials."
    }},
    token: () => { return {
      code: 403,
      message: "Request unsuccessful.",
      body: "Invalid token."
    }}
  },
  unavailable: {
    username: name => { return {
      code: 403,
      message: "Account already exists.",
      body: `The username ${name} is already taken.`
    }}
  },
  apiKeyDisabled: () => { return {
    code: 403,
    message: "Api key disabled.",
    body: `Api key is disabled on this account.`
  }},
  login: () => { return {
    code: 400,
    message: "Login unsuccessful.",
    body: "Missing login info."
  }}
}

module.exports = { sendError, Errors };
