const fs = require("fs");

const readFile = (path) => {
  return fs.readFileSync(path, "utf8");
};

module.exports = readFile;