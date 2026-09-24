const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { readDB, writeDB } = require("../../utils/db");
const crypto = require("crypto");

async function signUp(req, res) {
  const { name, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const userName = name?.trim();

  if (!normalizedEmail || !password || !userName) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }

  const db = await readDB();

  const existingUser = db.users.find(
    (u) => u.email === normalizedEmail
  );

  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: crypto.randomUUID(),
    name: userName,
    email: normalizedEmail,
    passwordHash: hashedPassword,
    role: 'user',
    refreshTokens: [],
    resetToken: null,
    resetTokenExpiry: null,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  await writeDB(db);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({ message: 'Account created successfully', token });
}

module.exports = { signUp };