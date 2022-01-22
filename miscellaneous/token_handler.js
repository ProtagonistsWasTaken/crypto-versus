// this file (you guessed it) handles tokens :O
const lockedArray = require("./locked_array.js");
const { sendError } = require("./error.js");

const Tokens = new lockedArray();
const key = Tokens.key;

function Token(username, length = 32, lifetime = 300000) {

  Object.defineProperty(this, "user", {
    enumerable:true,
    get:()=>{return username}
  });

  // this function (you guessed it) generates tokens
  Object.defineProperty(this, "generate", {
    enumerable:true,
    get:()=>{return length=>{
      var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-";
      var token = [];

      for(let i = 0; i < length; i++)
        token.push(characters[parseInt(Math.random()*characters.length)+1]);
      
      return token.join('');
    }}
  });

  var value = this.generate(length);
  Object.defineProperty(this, "value", {
    enumerable:true,
    get:()=>{return value}
  });

  Object.defineProperty(this, "lifetime", {
    enumerable:true,
    get:()=>{return lifetime}
  });

  Tokens.unlock(key);
  Tokens.add(this);
  Tokens.lock();

  setTimeout(()=>{
    this.invalidate();
  }, lifetime);

  Object.defineProperty(this, "invalidate", {
    enumerable:true,
    get:()=>{return ()=>{
      if(!Tokens.includes(this))return;
      Tokens.unlock(key);
      Tokens.remove(this);
      Tokens.lock();
    }}
  });

  Object.defineProperty(this, "refresh", {
    enumerable:true,
    get:()=>{return ()=>{
      this.invalidate();
      return Token.from({user:this.user, value:this.value, lifetime:300000});
    }}
  });
}

Token.prototype.toString = function toString()
{return this.value}

Object.defineProperty(Token, "from", {
  enumerable:true,
  get:()=>{return token=>{
    return new Token(token.user, token.value.length, token.lifetime);
  }}
});

Object.defineProperty(Token, "fromString", {
  enumerable:true,
  get:()=>{return (res, tokenString)=>{
    var token = Tokens.findOne({value: tokenString});
    if(!tokenString) {
      sendError(res, {code:400,
        message:"Missing token.",
        body:"Token is required."
      });
      return undefined;
    }
    else if(token === null) {
      sendError(res, {code:403,
        message:"Invalid token.",
        body:"Token is invalid."
      });
      return undefined;
    }
    else return token;
  }}
});

module.exports = {Token, Tokens}
