const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const readDB = require("./helpers/readFile")

async function loginUser(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const db = readDB('db.json')

  const user = db.users.find((u) => u.email === email)
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })

  res.status(200).json({
    message: 'Login successful',
    token
  })
}

module.exports = { loginUser }