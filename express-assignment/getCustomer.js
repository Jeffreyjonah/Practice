const readDB = require('./helpers/readFile')
function getCustomers(req, res) {

  const { page = 1, size = 10, tier, active, sortBy, order = 'asc' } = req.query
  let { customers } = readDB('db.json');

  if (tier === 'gold' || tier === 'silver' || tier === 'bronze') {
    customers = customers.filter(c => c.tier === tier)
  }

  // if (active === true || active === false) {
  //   const activeBool = active === undefined ? undefined : active === 'true';
  //   if (activeBool === undefined) {
  //     customers = customers.filter(c => c.active === activeBool);
  //   }
  // }


  if (active !== undefined) {
    const activeBool = active === 'true';
    customers = customers.filter(c => c.active === activeBool);
  }

  if (sortBy) {
    customers = customers.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return order === 'desc' ? 1 : -1;
      if (a[sortBy] > b[sortBy]) return order === 'desc' ? -1 : 1;
      return 0;
    })
  }

  const total = customers.length;
  const totalPages = Math.ceil(total / size);
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginated = customers.slice(startIndex, endIndex);

  res.json({
    data: paginated,
    meta: { page, size, total, totalPages }
  });
}

module.exports = { getCustomers }