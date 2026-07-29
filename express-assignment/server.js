const express = require('express');
const app = express();
const allRoutes = require('./routes')
const { getMe } = require('./getMe')
const { loginUser } = require('./loginUser')
const { signUp } = require('./register')
const dotenv = require('dotenv')
const middleware = require('./auth')

dotenv.config()

const PORT = 3002

//app.use() registers middleware code that runs on every incoming
//  request before it reaches your route handlers. express.json() is
//  built-in middleware that reads the request body, parses it as JSON, 
// and attaches it to req.body. Without this, if someone POSTs JSON data, req.body would be undefined.
app.use(express.json())

///api/me sits at the same level as /api/customers, not inside it: so it has to be registered directly in server.js, where the app itself controls the full top-level path, rather than through a router that's locked into the /customers prefix.

app.use('/api/customers', middleware, allRoutes)
app.post('/api/login', loginUser)
app.post('/api/sign-up', signUp)
app.get('/api/me', getMe)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
