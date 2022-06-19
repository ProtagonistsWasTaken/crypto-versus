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

module.exports = { sendError };
