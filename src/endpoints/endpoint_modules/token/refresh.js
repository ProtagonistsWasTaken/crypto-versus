const { User } = require("/src/database/mongodbSchemas");
const { generateToken, sendError, Errors } = require("/src/miscellaneous");

module.exports = {
  urls: [ "api/refresh-token", "api/token/refresh", "api/refresh" ],
  run: async function(req, res, data) {
    // Get the user
    const user = User.findOne({ token: { value: data.token } });

    // Check if token is invalid
    if(!user) return sendError(res, Errors.invalid.token);

    // Generate new token
    const token = generateToken(32);

    // Update token values for user
    user.token.value = token;
    user.token.expire = Date.now() + 1000 * 60 * 5;

    // Save changes
    await user.save();

    // Response headers
    res.setHeader("user", user.username);
    res.setHeader("expire", user.token.expire);

    // Response
    res.end(token);
  },
  method:'POST'
}
