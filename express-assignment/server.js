const express = require('express');
const app = express();
const allRoutes = require('./routes')

const PORT = 3002

//app.use() registers middleware — code that runs on every incoming request before it reaches your route handlers. express.json() is built-in middleware that reads the request body, parses it as JSON, and attaches it to req.body. Without this, if someone POSTs JSON data, req.body would be undefined.
app.use(express.json())

app.use('/api/customers', allRoutes)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
