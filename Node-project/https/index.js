// const http = require("http");


// //defined listener function
// const listener = function (request, response) {

//   response.writeHead(200, { 'Content-Type': 'text/html' });

//   response.end('<h2 style="text-align: center;">Hello World</h2>');
// };

// const server = http.createServer(listener);
// server.listen(3000); //listener is now open


// console.log('Server running at http://127.0.0.1:3000/'); //server starts running


const http = require('http');

const server = http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end('<h2 style="text-align:center;">Hallo World</h2>')
})

server.listen(3000);
console.log('Server running at http://127.0.0.1:3000')
