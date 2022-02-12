const { Token } = require("../../../miscellaneous/token_handler.js");

module.exports = {
  urls:["api/refresh-token", "api/token/refresh", "api/keep-alive"],
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
