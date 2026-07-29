const fs = require('fs');
const path = require('path');
const sendJson = require('./helpers/sendJson');

const dbPath = path.join(__dirname, 'db.json');

function getSpendCategory(totalSpend) {
  if (totalSpend >= 500000) return 'high';
  if (totalSpend >= 100000) return 'medium';
  return 'low';
}

function getCustomerSummary(req, res) {
  const id = req.url.split('/')[3];

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  const customer = db.customers.find(c => c.id === id);

  if (!customer) {
    return sendJson(res, 404, { error: 'Customer not found' });
  }

  const sorted = [...db.customers].sort((a, b) => b.totalSpend - a.totalSpend);
  const rank = sorted.findIndex(c => c.id === id) + 1;

  const summary = {
    id: customer.id,
    name: customer.name,
    tier: customer.tier,
    totalSpend: customer.totalSpend,
    spendCategory: getSpendCategory(customer.totalSpend),
    rank,
  };

  return sendJson(res, 200, summary);
}

module.exports = getCustomerSummary;