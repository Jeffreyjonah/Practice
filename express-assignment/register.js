const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const readDB = require("./helpers/readFile")
const writeDB = require("./helpers/writeFile")


async function signUp(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const db = readDB('db.json')

  const existingUser = db.users.find((u) => u.email === email)
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = { id: `u00${db.users.length + 1}`, email, password: hashedPassword }
  db.users.push(newUser)
  writeDB('db.json', db)

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

  res.status(201).json({ message: 'Account created successfully', token })
}

module.exports = { signUp }