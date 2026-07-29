const fs = require('fs')
const path = require('path')

module.exports = function readDB(file) {
  const data = fs.readFileSync(path.join(__dirname, '..', file), 'utf-8')
  return JSON.parse(data)
}

//const data = fs.readFileSync(path.join(process.cwd(), 'db.json'), 'utf-8')