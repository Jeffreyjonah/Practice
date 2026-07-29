const fs = require('fs');
const path = require('path');
const sendJson = require('./helpers/sendJson');

const dbPath = path.join(__dirname, 'db.json');

function getMe(req, res) {
  const customerId = req.headers['x-customer-id'];

  if (!customerId) {
    return sendJson(res, 400, { error: 'X-Customer-Id header is required' });
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  const customer = db.customers.find(c => c.id === customerId);

  if (!customer) {
    return sendJson(res, 404, { error: 'Customer not found' });
  }

  return sendJson(res, 200, customer);
}

module.exports = getMe;