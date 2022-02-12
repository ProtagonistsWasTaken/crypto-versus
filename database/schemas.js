const Mongoose = require("mongoose");
Mongoose.connect(process.env["DB_URL"]).then( function(){console.log("Connected to DB")});

class Event extends Mongoose.SchemaType {
  constructor(key, options) {
    super(key, options, "Event");
  }

  cast(val) {
    if(typeof val != "object")
      throw new Error("Cast value has to be of type 'object'");
    
    return val.data ? {
      name: val.name ? val.name : "event",
      data: val.data
    } : {name: val.name ? val.name : "event"};
  }
}

Mongoose.SchemaTypes.Event = Event;

// this schema handles all data in the "Salt" cluster
const Salt = Mongoose.model("Salt", new Mongoose.Schema({
  val: {
    type: String, // ensure the value is a String
    required: [true,"invalid salt creation"] // salt is required
  }
}));

// this schema handles all data in the "User" cluster
const User = Mongoose.model("User", new Mongoose.Schema({
  username: {
    type: String, // ensure the username is a String
    required: [true,"username is required"], // username is required.
    unique:true // ensure the user inputs a unique username 
  },
  password: {
    type: String, // ensure the password is a String. this should be hashed by bcrypt
    required: [true,"password is required"] // password is required
  },
  keyEnabled: {
    type: Boolean,
    value: false
  },
  key: String,
  events:{
    enabled: Boolean,
    ip: String,
    unhandled: [Event]
  }
}));

function setup() {
  Salt.find().then(salt => {
    if(salt.length < 1)
      new Salt({val: hash.genSalt(5)});
  });
}

module.exports = {setup, Salt, User};
