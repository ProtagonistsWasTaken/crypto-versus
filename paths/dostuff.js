const { Tokens } = require("../miscellaneous/token_handler.js");
const { getToken } = require("../miscellaneous/helper.js");

module.exports = {
  urls:["dostuff"],
  run:async function(req, res, data) {
    var token = getToken(res, data.token);
    if(token) res.end(`Successfully did stuff as ${token.user}`);
  },
  method:'POST'
}
