const http = require('http')
const sendJson = require('./helpers/sendJson')

const server = http.createServer((req, res) => {
  const url = req.url
  const method = req.method;
  if (url === '/' && method === 'GET') {
    sendJson(res, 200, 'Welcome to my first Node.js Server')
  } else if (url === '/' && method !== 'GET') {

    sendJson(res, 405, { "error": "Method Not Allowed" })
  } else {
    sendJson(res, 404, { "error": "Not Found" })
  }
})

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:3000`)
});
