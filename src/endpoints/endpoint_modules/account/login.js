// this route handles all /login requests
const bcrypt = require("bcrypt");
const { Salt, User } = require("/src/database/mongodbSchemas.js");
const userSchema = require("/src/database/schemas.js");
const { generateToken, validateUserInfo, sendError } = require("/src/miscellaneous");

module.exports = {
  urls: ["api/login","api/signin","api/sign-in", "api/account/login", "api/account/signin", "api/account/sign-in"],
  run: async function(req, res, data) {
// Login using credentials
    if(data.username && data.password) {
      if(validateUserInfo(res, data)) {

        const salt = await Salt.find();
        const password = await bcrypt.hash(data.password, salt[0].val);
        const user = await User.findOne({username: data.username});

        if(user === null || user.password != password)
          sendError(res, {
            code: 403,
            message: "Login unsuccessful.",
            body: "Invalid credentials."
          });
        else {
          // Generate a token
          const token = generateToken(32);

          user.token.value = token;
          user.token.expire = Date.now() + 1000 * 60 * 10;

          await user.save();

          res.setHeader("user", user.username);
          res.setHeader("expire", user.token.expire);
          res.setHeader("key", user.key.enabled);
          res.end(token);
        }
      }
    }
    // Login using api key
    else if(data.key) {
      const salt = await Salt.find();
      const key = await bcrypt.hash(data.key, salt[0].val);
      const user = await User.findOne({ key: { value: key } });

      if(user === null)
        sendError(res, {
          code: 403,
          message: "Login unsuccessful.",
          body: "Invalid credentials."
        });
      else if(!user.key.enabled)
        sendError(res, {
          code: 403,
          message: "Api key disabled.",
          body: `Api key is disabled on this account.`
        });
      else {
        // Generate a token
        const token = generateToken(32);

        user.token.value = token;
        user.token.expire = Date.now() + 1000 * 60 * 10;

        await user.save();

        res.setHeader("user", user.username);
        res.setHeader("expire", user.token.expire);
        res.setHeader("key", user.key.enabled);
        res.end(token);
      }
    }
    else sendError(res, {
      code: 400,
      message: "Login unsuccessful.",
      body: "Missing login info."
    });
  },
  method:'POST'
}
