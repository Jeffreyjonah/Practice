const sendJson = require('./helpers/sendJson');
const fs = require('fs');
const path = require('path');

// We check if the Content-Type header is set to application/json.
//  If not, we return a 415 Unsupported Media Type error.
module.exports = function create(req, res) {
  if (!req.headers['content-type']?.includes('application/json')) {
    return sendJson(res, 415, {
      error: 'Unsupported Media Type',
    });
  }

  //In raw Node.js HTTP, request bodies do not come fully formed as one object.
  //They arrive as a stream of chunks.
  //So you need a variable to accumulate those chunks into one full string.
  let body = '';


  //Each time a chunk of the request body arrives, you append it to body.
  // it might arrive in multiple pieces. This code joins them back into one full string.


  req.on('data', chunk => {
    body += chunk;
  });
  //req.on() is an EventEmitter.
  //It emits events while data is arriving.
  //One of those events is "data" which means "Here's another piece of the request body."
  //Each chunk triggers the callback. body += chunk joins all the chunks together

  req.on('end', () => {
    try {
      const data = JSON.parse(body);

      const { name, email, phone, tier } = data;

      if (!name || !email || !phone || !tier) {
        return sendJson(res, 400, {
          error: 'Missing required fields',
        });
      }

      const validTiers = ['gold', 'silver', 'bronze'];

      if (!validTiers.includes(tier)) {
        return sendJson(res, 422, {
          error: 'Invalid tier',
        });
      }

      const dbPath = path.join(__dirname, 'db.json');
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

      //fs.readFileSync(...) reads the file as text
      //JSON.parse(...) converts the text into a JavaScript object.
      // stores that object in the db

      const lastCustomer = db.customers[db.customers.length - 1];
      const lastIdNumber = Number(lastCustomer.id.slice(1));

      const newId = `c${String(lastIdNumber + 1).padStart(3, '0')}`;

      const newCustomer = {
        id: newId,
        name,
        email,
        phone,
        tier,
        active: data.active ?? true,
        totalSpend: data.totalSpend ?? 0,
      };

      db.customers.push(newCustomer);

      fs.writeFileSync(
        dbPath,
        JSON.stringify(db, null, 2)
      );

      return sendJson(res, 201, newCustomer);
    } catch (error) {
      return sendJson(res, 400, {
        error: 'Invalid JSON',
      });
    }
  });
}