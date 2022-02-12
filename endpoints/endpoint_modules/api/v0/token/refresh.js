const { Token } = require("../../../../../miscellaneous/token_handler.js");

module.exports = {
  urls:["api/v0/refresh-token", "api/v0/token/refresh"],
  run:async function(req, res, data) {
    const token = Token.fromString(res, data.token);
    if(token) {
      const newToken = token.refresh();
      res.setHeader("expire", newToken.lifetime);
      res.end(newToken.value);
    }
  },
  method:'POST'
}
