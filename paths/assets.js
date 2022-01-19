fs = require("fs");
path = require("path");

// I like this path - Pywon
module.exports = {
  urls:["assets/fonts/RobotoMono-Regular.ttf", "assets/RobotoMono-Regular.ttf", "assets/fonts/RobotoMono-Regular.woff", "assets/RobotoMono-Regular.woff"],
  run:async function(req, res) {
    let filename = req.url.split("/").pop();
    res.end(fs.readFileSync(path.join(__dirname, `../assets/fonts/${filename}`)));
  }
}