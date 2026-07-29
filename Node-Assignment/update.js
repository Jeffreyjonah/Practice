const readFile = require('./helpers/readFile')
const sendJson = require('./helpers/sendJson')
const fs = require('fs')

module.exports = function update(req, res) {
  let url = req.url
  let splittedUrl = url.split('/')
  let id = splittedUrl[3]

  let body = ''

  req.on('data', chunk => {
    body += chunk
  })

  req.on('end', () => {
    const { customers } = readFile('./db.json')
    const data = JSON.parse(body)

    if (data.id) {
      return sendJson(res, 400, { error: 'Bad Request' })
    }

    if (data.tier && data.tier !== 'bronze' && data.tier !== 'silver' && data.tier !== 'gold') {
      return sendJson(res, 422, { 'error': 'Unprocessable Entity' })
    }

    const customer = customers.find(c => c.id === id)

    if (!customer) {
      return sendJson(res, 404, { error: 'Customer not found' })
    }

    const updateCustomer = { ...customer, ...data }

    const index = customers.findIndex(c => c.id === id)
    customers[index] = updateCustomer

    fs.writeFileSync('db.json', JSON.stringify({ customers }, null, 2), 'utf-8')
    return sendJson(res, 200, updateCustomer)
  })
}