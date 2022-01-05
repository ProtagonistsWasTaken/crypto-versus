// this route handles all /delete requests
const { User } = require("../../database/schemas.js");
const { getToken } = require("../../miscellaneous/helper.js");

module.exports = {
  urls:["delete-account"],
  run:async function(req, res, data) {
    var token = getToken(res, data.token);
    if(token) {
      var result = await User.deleteOne({username: token.user});
      if(!result.deletedCount) {
        res.setHeader("status", "Database error.");
        res.statusCode = 500;
        res.end(`Could not delete ${token.user}`);
      }
      else {
        token.invalidate();
        res.end(`${token.user} deleted successfully!`);
      }
    }
  },
  method:'POST'
}
