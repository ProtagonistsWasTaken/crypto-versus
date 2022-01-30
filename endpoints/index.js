const fileExports = [];

const fs = require("fs");
const path = require("path")

const findFiles = (dir, files) => {
  const dirFiles = fs.readdirSync(dir)
  dirFiles.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      findFiles(filePath, files)
    } else {
      fileExports.push(require(filePath));
    }
  })
}

findFiles(path.join(__dirname, "./endpoint_modules"));
// console.log(fileExports);
module.exports = fileExports;