// Imports
const { Schema } = require("@protagonists/coerce");
const { StringType, IntRange } = require("@protagonists/coerce-basics");

// Create 'Options' Schema
const Options = new Schema({
  code: IntRange(100, 599),
  message: StringType,
  body: StringType
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
    }},
    paramType: (name, type) => { return {
      code: 403,
      message: "Invalid value type.",
      body: `Invalid value for parameter '${name}', expected ${type}.`
    }}
  },
  unavailable: {
    username: name => { return {
      code: 403,
      message: "Account already exists.",
      body: `The username ${name} is already taken.`
    }}
  },
  disabled: {
    apiKey: () => { return {
      code: 403,
      message: "Api key disabled.",
      body: "Api key is disabled on this account."
    }},
    events: () => { return {
      code: 403,
      message: "Events disabled",
      body: "Events are disabled on this account"
    }}
  },
  login: () => { return {
    code: 400,
    message: "Login unsuccessful.",
    body: "Missing login info."
  }},
  expired: () => { return {
    code: 403,
    message: "Request unsuccessful.",
    body: "Token is expired."
  }},
  database: {
    duplicateUser: (name) => { return {
      code: 409,
      message: "Database conflict.",
      body: `The username ${name} is already taken.`
    }},
    inexistantUser: () => { return {
      code: 410,
      message: "Gone",
      body: "The requested account no longer exists."
    }}
  },
  callback: {
    unreachable: () => { return {
      code: 400,
      message: "Callback unreachable",
      body: "An error occured while trying to send a request to the user's event domain"
    }},
    failure: () => { return {
      code: 424,
      message: "Callback failure",
      body: "The user's event domain did not respond with code 200"
    }},
    timeout: () => { return {
      code: 408,
      message: "Request Timeout",
      body: "The user's event domain did not respond within 10 seconds"
    }},
    inexistantTarget: () => { return {
      code: 403,
      message: "Inexistant target",
      body: "Target user was not valid"
    }}
  }
}

module.exports = { sendError, Errors };
