const { Router } = require('express')
const router = Router()
const { getCustomers } = require('./getCustomer')
const { getCustomerById } = require('./getCustomerId')
const { createCustomer } = require('./createCustomer')
const { patchCustomer } = require('./updateCustomer')
const { deleteCustomer } = require('./deleteCustomer')
const { getCustomerSummary } = require('./getCustomerSUmmary')

router.get('/', getCustomers)
router.get('/:id/summary', getCustomerSummary)
router.get('/:id', getCustomerById)
router.post('/', createCustomer)
router.patch('/:id', patchCustomer)
router.delete('/:id', deleteCustomer)

router.post('/post-customer', (req, res) => {
  console.log('Post customer')
  res.json({ message: 'Post customer' })
})

module.exports = router