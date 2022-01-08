fs = require("fs")
path = require("path")

module.exports = {
    urls: [".well-known/security.txt"],
    run: async function (req, res) {
        console.log(path.join(__dirname, "../security.txt"))
        res.end(fs.readFileSync(path.join(__dirname, "../security.txt")))
    }
}
