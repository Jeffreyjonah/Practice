const http = require('http');
const sendJson = require('./helpers/sendJson');
const getCustomers = require('./getCustomers');
const getCustomerById = require('./getCustomerById');
const update = require('./update');
const deleteCustomer = require('./deleteCustomer');
const getCustomerSummary = require('./getCustomerSummary');
const getMe = require('./getMe');
const createCustomer = require('./createCustomer')

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  const parsedURL = new URL(url, 'http://x')
  const params = parsedURL.searchParams;
  // Extracts the searchParams object from the URL.
  // params is now an object you can query with .get(...).

  const page = Number(params.get('page')) || 1;
  const size = Number(params.get('size')) || 5;
  const tier = params.get('tier');
  const active = params.get('active');
  const sortBy = params.get('sortBy');
  const order = params.get('order');


  const pathname = parsedURL.pathname;

  if (pathname === '/api/customers' && method === 'GET') {
    sendJson(
      res,
      200,
      getCustomers({
        page,
        size,
        tier,
        active,
        sortBy,
        order,
      })
    );
  }

  else if (pathname === '/api/customers' && method === 'POST') {
    createCustomers(req, res);
  }

  // else if ( pathname.endsWith('/summary') && method === 'GET') {
  //   getCustomerSummary(req, res);
  // }
  else if (pathname.startsWith('api/customers/') && pathname.endsWith('/summary') && method === 'GET') {
    getCustomerSummary(req, res);
  }

  else if (
    pathname.startsWith('/api/customers/') &&
    method === 'GET'
  ) {
    getCustomerById(req, res);
  }
  else if (pathname.startsWith('/api/customers/') && method === 'PATCH') {
    update(req, res)
  }
  else if (pathname.startsWith('/api/customers/') && method === 'DELETE') {
    deleteCustomer(req, res);
  }
  else if (pathname === '/api/me' && method === 'GET') {
    getMe(req, res);
  }

  else if (
    pathname === '/api/me' ||
    pathname === '/api/customers' ||
    pathname.startsWith('/api/customers/')
  ) {
    sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  else {
    sendJson(res, 404, {
      error: 'Not Found',
    });
  }
});

const port = Number(process.env.PORT) || 3001;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});