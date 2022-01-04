// this file (you guessed it) handles tokens :O
const lockedArray = require("./locked_array.js");

const Tokens = new lockedArray();
const key = Tokens.key;

class Token {
  constructor(username, length = 32, lifetime = 300000) {
    this.user = username;
    this.value = this.generate(length);
    this.lifetime = lifetime;
    Tokens.unlock(key);
    Tokens.add(this);
    Tokens.lock();

    setTimeout(()=>{
      this.invalidate();
    }, lifetime);
  }

  generate(length) {
    var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-";
    var token = [];

    for(let i = 0; i < length; i++)
      token.push(characters[parseInt(Math.random()*characters.length)+1]);
    
    return token.join('');
  }

  invalidate() {
    if(!Tokens.includes(this))return;
    Tokens.unlock(key);
    Tokens.remove(this);
    Tokens.lock();
  }

  refresh() {
    this.invalidate();
    return new Token(this.user, this.length, this.lifetime);
  }
}
Token.prototype.toString = function toString()
{return this.value}

module.exports = {Token, Tokens}
