const fs = require('fs');

module.exports = function readFile(file) {
  const data = fs.readFileSync('db.json', 'utf-8')
  return JSON.parse(data)
}