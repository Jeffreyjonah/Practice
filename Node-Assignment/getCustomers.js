const readFile = require('./helpers/readFile')

module.exports = function getCustomers({ page = 1, size = 5, tier, active, sortBy, order }) {
  const { customers } = readFile('./db.json')

  const startPage = (page - 1) * size
  const endPage = startPage + size
  let data;
  let total;

  let filtereddata = customers

  if (tier === 'gold' || tier === 'silver' || tier === 'bronze') {
    filtereddata = filtereddata.filter(c => c.tier === tier)
  }

  if (active === 'true' || active === 'false') {
    filtereddata = filtereddata.filter(
      c => c.active === (active === 'true')
    );
  }

  if (sortBy) {
    if (order === 'asc') {
      filtereddata = filtereddata.sort((a, b) => {
        if (typeof a[sortBy] === 'string') {
          return (a[sortBy].localeCompare(b[sortBy])
          )
        } else { return a[sortBy] - b[sortBy] }
      })
    } else if (order === 'desc') {
      filtereddata = filtereddata.sort((a, b) => {
        if (typeof b[sortBy] === 'string') {
          return (b[sortBy].localeCompare(a[sortBy])
          )
        } else { return b[sortBy] - a[sortBy] }
      })
    }
  }

  data = filtereddata.slice(startPage, endPage)
  total = filtereddata.length

  const totalPages = Math.ceil(total / size)

  return { data, meta: { page, size, total, totalPages } }
}