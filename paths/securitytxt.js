fs = require("fs");
path = require("path");

module.exports = {
    urls: [".well-known/security.txt", "/security.txt"],
    run: async function (req, res) {
      res.end(fs.readFileSync(path.join(__dirname, "../security.txt")));
    }
}
