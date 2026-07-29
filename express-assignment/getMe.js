const readDB = require('./helpers/readFile')

//req — everything about the incoming request (headers, params, body, etc.)
// res — the object you use to send a response back
function getMe(req, res) {
  const customerId = req.headers['x-customer-id']


  //req.headers is a plain JavaScript object containing all the HTTP headers sent with the request, e.g. { 'x-customer-id': 'c007', 'user-agent': '...', host: '...' }.
  // We access it with bracket notation['x-customer-id'] because the key contains hyphens — you can't write req.headers.x-customer-id since - would be parsed as subtraction.

  if (!customerId) {
    return res.status(400).json({ error: 'X-Customer-Id header is required' })
  }


  //Calls the helper, we read it fresh on every request (rather than once at startup) so we always see the latest data, including changes made by other endpoints like PATCH or DELETE.
  const db = readDB('db.json')
  const customer = db.customers.find((c) => c.id === customerId)

  //if customer is undefined respond with 404 not found
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' })
  }

  res.status(200).json(customer)
}

module.exports = { getMe }