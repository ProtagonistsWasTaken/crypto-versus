const { Schema } = require("@protagonists/coerce");

const userOptions = new Schema({
  username: String,
  password: String,
  key: String,
  keyEnabled: Boolean,
  token: String,
  expire: Date
});
userOptions.setDefaults({
  key: '',
  keyEnabled: false
});

const editData = new Schema({
  username: String,
  password: String,
  keyEnabled: Boolean
});
editData.setDefaults({
  username: '',
  password: '',
  keyEnabled: false
});

module.exports = { userOptions, editData };
