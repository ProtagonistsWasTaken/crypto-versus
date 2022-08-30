const { connectionData, User } = require("../../../database");
const { sendError, Errors } = require("../../../miscellaneous/error");

module.exports = {
  urls: [ "api/events/*" ],
  run: async function(req, res) {
    res.end("Hello!");
  },
  method: 'GET'
}
