fs = require("fs");
path = require("path");

// I like this path - Pywon
module.exports = {
  urls:["", "?", "index", "index?"],
  run:async function(req, res) {
    res.end(fs.readFileSync(path.join(__dirname, "../main/index.html")));
  }
}