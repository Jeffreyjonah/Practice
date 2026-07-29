const fs = require('fs');
const path = require('path');
const sendJson = require('./helpers/sendJson');

const dbPath = path.join(__dirname, 'db.json');

module.exports = function deleteCustomer(req, res) {
  const id = req.url.split('/').pop();

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  const index = db.customers.findIndex(c => c.id === id);

  if (index === -1) {
    return sendJson(res, 404, { error: 'Customer not found' });
  }

  db.customers.splice(index, 1);

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.writeHead(204);
  res.end();
}
