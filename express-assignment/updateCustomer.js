const readDB = require('./helpers/readFile')
const writeDB = require('./helpers/writeFile')
const express = require('express')

const validTiers = ['gold', 'silver', 'bronze']

function patchCustomer(req, res) {
  const { id } = req.params
  const updates = req.body

  if ('id' in updates) {
    return res.status(400).json({ error: 'Cannot change id' })
  }

  if ('tier' in updates && !validTiers.includes(updates.tier)) {
    return res.status(400).json({
      error: `Invalid tier. Must be one of: ${validTiers.join(', ')}`
    })
  }

  const db = readDB('db.json')
  const customerIndex = db.customers.findIndex(c => c.id === id)

  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found' })
  }

  db.customers[customerIndex] = {
    ...db.customers[customerIndex],
    ...updates
  }

  writeDB('db.json', db)

  res.status(200).json(db.customers[customerIndex])
}

module.exports = { patchCustomer }