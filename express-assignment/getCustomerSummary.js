const readDB = require('./helpers/readFile')

function getSpendCategory(totalSpend) {
  if (totalSpend < 10000) return 'low'
  if (totalSpend < 50000) return 'medium'
  return 'high'
}

function getCustomerSummary(req, res) {
  const { id } = req.params

  const db = readDB('db.json')
  const customer = db.customers.find((c) => c.id === id)

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' })
  }

  const sortedBySpend = [...db.customers].sort(
    (a, b) => b.totalSpend - a.totalSpend
  )
  const rank = sortedBySpend.findIndex((c) => c.id === id) + 1

  res.status(200).json({
    id: customer.id,
    name: customer.name,
    tier: customer.tier,
    totalSpend: customer.totalSpend,
    getSpendCategory: getSpendCategory(customer.totalSpend),
    rank
  })
}

module.exports = { getCustomerSummary }