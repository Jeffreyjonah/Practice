const fs = require('fs');
const path = require('path');

function writeDB(filename, data) {
  fs.writeFileSync(path.join(__dirname, "..", filename), JSON.stringify(data, null, 2))
}

module.exports = writeDB;