const jwt = require('jsonwebtoken')

module.exports = function middleware(req, res, next) {
  const authHeaders = req.headers['authorization']

  if (!authHeaders) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeaders.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}