const { Tokens } = require("../../miscellaneous/token_handler.js");
const { getToken } = require("../../miscellaneous/helper.js");

module.exports = {
  urls:["refresh-token"],
  run:async function(req, res, data) {
    var token = getToken(res, data.token);
    if(token) res.end(token.refresh().value);
  },
  method:'POST'
}
