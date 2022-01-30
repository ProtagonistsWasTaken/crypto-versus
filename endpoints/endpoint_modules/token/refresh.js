const { Token } = require("../../../miscellaneous/token_handler.js");
const { set } = require("../../../miscellaneous/authenticate")

module.exports = {
  urls:["api/refresh-token", "api/token/refresh"],
  run:async function(req, res, data) {
    const token = Token.fromString(res, data.token);
    if(token) {
      console.trace()
      const newToken = token.refresh();
      res.setHeader("expire", newToken.lifetime);
      res.end(newToken.value);
    }
  },
  method:'POST'
}
