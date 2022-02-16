const { Token, sendError, Webhook } = require("../../../miscellaneous");
const { User } = require("../../../database/schemas.js");

module.exports = {
  urls:["api/dostuff"],
  run:function(req, res, data) {
    return new Promise((resolve, reject)=>{
      const token = Token.fromString(res, data.token);
      if(token) {
        User.findOne({username: token.user}).then(user=>{
          if(!user.events.enabled)
            resolve(sendError(res, {code:400,
              message:"Events disabled",
              body:`${user.username} does not have events enabled`
            }));
          else {
            Webhook.send(user, {name:"ping",data:"You did stuff!"}).then(()=>{
              res.end(`Successfully did stuff as ${token.user}`);
              resolve();
            }).catch(e=>{
              if(e === "Timeout")
                sendError(res, {code:408,
                  body:`The host for ${user.username} did not respond in time`
                });
              else
                sendError(res, {code:400,
                  message:"Invalid host response",
                  body:`The host for ${user.username} responded in an unexpected way`
                });
              resolve();
            });
          }
        });
      }
    });
  },
  method:'POST'
}
