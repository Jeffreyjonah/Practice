const { Router } = require('express')
const router = Router()
const { getCustomers } = require('./getCustomer')
const { getCustomerById } = require('./getCustomerId')

router.get('/', getCustomers)
router.get('/:id', getCustomerById)

router.post('/post-customer', (req, res) => {
  console.log('Post customer')
  res.json({ message: 'Post customer' })
})

module.exports = router
