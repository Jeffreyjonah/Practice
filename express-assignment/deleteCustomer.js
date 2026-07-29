const readDB = require('./helpers/readFile')
const writeDB = require('./helpers/writeFile')

function deleteCustomer(req, res) {
  const { id } = req.params

  const db = readDB('db.json')
  const customerIndex = db.customers.findIndex((c) => c.id === id)

  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found' })
  }

  db.customers.splice(customerIndex, 1)

  writeDB('db.json', db)

  res.status(204).send()
}

module.exports = { deleteCustomer }