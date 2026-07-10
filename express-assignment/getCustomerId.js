const readDB = require('./helpers/readFile')

function getCustomerById(req, res) {
  const segments = req.url.split('/')
  const id = segments[segments.length - 1].split('?')[0];

  const { customers } = readDB('db.json');
  //Load the full customer list. (Using const here is fine since we're not reassigning customers in this file — no filtering/sorting happening.)
  const customer = customers.find(c => c.id === id);
  //.find() scans the array and returns the first element where the callback returns true — or undefined if nothing matches. Unlike .filter() (which returns an array of all matches), .find() returns a single object directly, which is exactly what you want for "fetch one customer by id."

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' })
  }
  res.json(customer);
}

module.exports = { getCustomerById }