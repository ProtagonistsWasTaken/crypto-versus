// this file (you guessed it) handles webhooks :O
const handler = require("@protagonists/https");
const { User } = require("../database/schemas.js");

const Webhook = {
  send:function send(user, event) {
    return new Promise((resolve, reject)=>{
      if(!user instanceof User)
        reject("user must be an instance of Mongoose.Schema");

      if(user.events.enabled)
        handler.Post({host:user.events.ip}, event, res => {
          if(res.err) reject(res.err);
          else if(res.status.code === 200) resolve();
          else reject("Invalid");
        });
      else {
        user.events.unhandled.push(event);
        user.save().then(resolve);
      }
    });
  },
  update:function update(user) {
    return new Promise((resolve, reject)=>{
      if(!user instanceof User)
        reject("user must be an instance of Mongoose.Schema");
      
      for(const i = 0; i < user.events.unhandled.length; i++) {
        if(user.events.enabled)
          handler.Post({host:user.events.ip}, user.events.unhandled[i], res => {
            if(res.err) reject(res.err);
            else if(res.status.code !== 200) reject("Invalid");
          });
      }

      user.events.unhandled = [];
      user.save().then(resolve);
    });
  }
};

Object.freeze(Webhook);
module.exports = { Webhook };
