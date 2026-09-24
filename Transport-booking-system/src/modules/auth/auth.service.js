const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { readDB, updateDB } = require('../../utils/db');
const AppError = require('../../utils/appError');
const { jwtSecret, jwtRefreshSecret, accessTokenExpiry, refreshTokenExpiry } = require('../../config/env');

function signAccessToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: accessTokenExpiry });
}

function signRefreshToken(user) {
  return jwt.sign({ id: user.id }, jwtRefreshSecret, { expiresIn: refreshTokenExpiry });
}

async function login({ email, password }) {
  const normalizedEmail = email?.trim().toLowerCase();
  const db = await readDB();
  const user = db.users.find((u) => u.email === normalizedEmail);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('Invalid email or password', 401);
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await updateDB((data) => {
    const u = data.users.find((x) => x.id === user.id);
    u.refreshTokens.push(refreshToken);
    return data;
  });

  return { user, accessToken, refreshToken };
}

async function refreshAccessToken(token) {
  if (!token) throw new AppError('Refresh token missing', 401);

  let decoded;
  try {
    decoded = jwt.verify(token, jwtRefreshSecret);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const db = await readDB();
  const user = db.users.find((u) => u.id === decoded.id);

  if (!user || !user.refreshTokens.includes(token)) {
    throw new AppError('Refresh token not recognized (possibly revoked)', 401);
  }

  const accessToken = signAccessToken(user);
  return { user, accessToken };
}

async function logout(token) {
  if (!token) return; // nothing to invalidate
  await updateDB((data) => {
    data.users.forEach((u) => {
      u.refreshTokens = u.refreshTokens.filter((t) => t !== token);
    });
    return data;
  });
}

async function forgotPassword(email) {
  const normalizedEmail = email?.trim().toLowerCase();
  const db = await readDB();
  const user = db.users.find((u) => u.email === normalizedEmail);

  // Don't leak whether the email exists — respond the same way either way,
  // but only actually generate/log a token if the user exists.
  if (!user) return null;

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

  await updateDB((data) => {
    const u = data.users.find((x) => x.id === user.id);
    u.resetToken = resetToken;
    u.resetTokenExpiry = resetTokenExpiry;
    return data;
  });

  // Simulated "send" — swap this line for a real mail service later.
  console.log(`Password reset token for ${normalizedEmail}: ${resetToken}`);
  return resetToken;
}

async function resetPassword(token, newPassword) {
  const db = await readDB();
  const user = db.users.find((u) => u.resetToken === token);

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
    throw new AppError('Password reset token is invalid or has expired', 400);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await updateDB((data) => {
    const u = data.users.find((x) => x.id === user.id);
    u.passwordHash = passwordHash;
    u.resetToken = null;
    u.resetTokenExpiry = null;
    u.refreshTokens = [];
    return data;
  });
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
};