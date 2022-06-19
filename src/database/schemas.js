const { Schema } = require("@protagonists/coerce");

const userOptions = new Schema({
  username: String,
  password: String,
  key: {
    value: String,
    enabled: Boolean
  },
  token: {
    value: String,
    expire: Date
  }
});
userOptions.setDefaults({
  key: {
    value: "",
    enabled: false
  }
});

module.exports = userOptions;
