function sendError(res, options){
  res.statusCode = options.code ? options.code : 500;
  res.statusMessage = options.message ? options.message : "Unidentified error.";
  res.end(options.body ? options.body : "An error occured.");
}

module.exports = { sendError };