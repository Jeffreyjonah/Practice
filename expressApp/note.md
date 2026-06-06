const express = require('express');
const app = express();

app.get('/', function (req, res) {
res.send("Welcome to tutorials point!");
})

app.listen(3000);

This function tells what to do when a get request at the given route is called. The callback function has 2 parameters, request(req) and response(res). The request object(req) represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, etc. Similarly, the response object represents the HTTP response that the Express app sends when it receives an HTTP request.

This function takes an object as input and it sends this to the requesting client. Here we are sending the string "Hello World!".
