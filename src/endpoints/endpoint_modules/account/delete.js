// this route handles all /delete requests
const { User } = require("/src/database/schemas.js");
const { Token, sendError } =  require("/src/miscellaneous");

module.exports = {
  urls:["api/delete-account", "api/account/delete"],
  run:async function(req, res, data) {
    const token = Token.fromString(res, data.token);
    
    if(token) {
      const result = await User.deleteOne({username: token.user});  // try to delete the user
      if(!result.deletedCount) {
        sendError(res, {code:500,
          message:"Database error.",
          body:`Could not delete ${token.user}`
        });
      }
      else {
        token.invalidate();
        res.end(`${token.user} deleted successfully!`);
      }
    }
  },
  method:'POST'
}
