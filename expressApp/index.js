const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send("Welcome to tutorials point!");
})

app.listen(3000);
