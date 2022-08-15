const { Schema } = require("@protagonists/coerce");
const { StringType, BooleanType, DateType } = require("@protagonists/coerce-basics");

const userOptions = new Schema({
  username: StringType,
  password: StringType,
  key: StringType,
  keyEnabled: BooleanType,
  token: StringType,
  expire: DateType
});
userOptions.setDefaults({
  key: '',
  keyEnabled: false
});

const editData = new Schema({
  username: StringType,
  password: StringType,
  keyEnabled: BooleanType
});
editData.setDefaults({
  username: '',
  password: '',
  keyEnabled: false
});

module.exports = { userOptions, editData };
