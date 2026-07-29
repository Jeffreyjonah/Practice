const readDB = require('./helpers/readFile')
const writeDB = require('./helpers/writeFile')

function createCustomer(req, res) {
  //req.headers is an object holding every HTTP header sent with the request, with lowercase keys. Content-Type tells the server what format the request body is in
  try {
    const contentType = req.headers['content-type'];

    if (contentType != 'application/json') {
      return res.status(415).json({ error: 'Unsupported Media Type' });
    }


    //JSON.parse() throws an error if the string isn't valid JSON (e.g. malformed syntax, or empty body). Wrapping it in try/catch means a bad request won't crash your server — instead you catch the error and respond with a controlled 400.

    const { name, email, phone, tier, active, totalSpend } = req.body;

    if (!name || !email || !phone || !tier) {
      return res.status(422).json({ error: 'Missing required fields' });
    }

    //.includes() checks whether tier matches one of the three allowed strings. If not, 422 — exactly as the task specifies.
    const validTiers = ['gold', 'silver', 'bronze'];
    if (!validTiers.includes(tier)) {
      return res.status(422).json({ error: 'Invalid tier' })
    }

    //Load the current database fresh (so you're never working from stale data), then grab the array.
    const db = readDB('db.json');
    const customers = db.customers;

    const lastId = customers[customers.length - 1].id
    const splitId = Number(lastId.split('c')[1])
    const nextId = splitId + 1
    const newId = 'c' + String(nextId).padStart(3, '0')

    const newCustomer = {
      id: newId,
      name,
      email,
      phone,
      tier,
      totalSpend: totalSpend || 0,
      active: active !== undefined ? active : true
    };

    customers.push(newCustomer);
    db.customers = customers;

    writeDB('db.json', db);
    res.status(201).json(newCustomer);
  }
  catch {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = { createCustomer }