// this file (you guessed it) handles tokens :O
function generateToken(length) {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-";
  const token = [];

  for(let i = 0; i < length; i++)
    token.push(characters[parseInt(Math.random()*characters.length)+1]);
      
  return token.join('');
}

module.exports = generateToken;
