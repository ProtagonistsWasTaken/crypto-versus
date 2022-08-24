const { Schema } = require("@protagonists/coerce");
const { StringType, BooleanType, DateType } = require("@protagonists/coerce-basics");

const userOptions = new Schema({
  username: StringType,
  password: StringType,
  key: StringType,
  keyEnabled: BooleanType,
  token: StringType,
  expire: DateType,
  eventDomain: StringType,
  eventsEnabled: BooleanType
});
userOptions.setDefaults({
  key: '',
  keyEnabled: false,
  eventDomain: '',
  eventsEnabled: false
});

const editData = new Schema({
  username: StringType,
  password: StringType,
  keyEnabled: BooleanType,
  token: StringType,
  eventDomain: StringType,
  eventsEnabled: BooleanType
});
editData.setDefaults({
  username: '',
  password: '',
  keyEnabled: false,
  eventDomain: '',
  eventsEnabled: false
});

const connectionData = new Schema({
  token: StringType
});

module.exports = { userOptions, editData, connectionData };
