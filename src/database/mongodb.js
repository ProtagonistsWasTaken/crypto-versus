const Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
Mongoose.connect(process.env["DB_URL"]).then( function(){
  console.log("Connected to DB")
});

// this schema handles all data in the "Salt" cluster
const Salt = Mongoose.model("Salt", new Mongoose.Schema({
  value: {
    type: String, // ensure the value is a String
    require: [true,"invalid salt creation"] // salt is required
  }
}));

// this schema handles all data in the "User" cluster
const User = Mongoose.model("User", new Mongoose.Schema({
  username: {
    type: String, // ensure the username is a String
    required: [true,"username is required"], // username is required.
    unique: true // ensure the user inputs a unique username
  },
  password: {
    type: String, // ensure the password is a String. this should be hashed by bcrypt
    required: [true,"password is required"] // password is required
  },
  key: String,
  keyEnabled: Boolean,
  token: {
    type: String,
    value: "Empty"
  },
  expire: Date,
  ping: Boolean
}));

async function setup() {
  const salt = await Salt.find()
  if(salt.length < 1) {
    const newSalt = new Salt({value: await bcrypt.genSalt(5)});
    await newSalt.save();
  }
}

module.exports = { setup, Salt, User };
