const readFile = require('./helpers/readFile');
const sendJson = require('./helpers/sendJson');

module.exports = function getCustomerById(req, res) {
  const { customers } = readFile('./db.json');
  const url = req.url
  const customerId = url.split('/')[3];

  const customer = customers.find(cus => cus.id === customerId);

  if (!customer) {
    return sendJson(res, 404, {
      error: 'Customer not found'
    });
  }
  return sendJson(res, 200, customer)
};