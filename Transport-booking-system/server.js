// const dotenv = require('dotenv')
// const express = require('express');

// const app = express();
// const authRoutes = require("./src/modules/auth/auth.routes")

// dotenv.config()

// const PORT = 5000

// app.use(express.json())
// app.use("/api/auth", authRoutes)

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

// process.on('exit', (code) => {
//   console.log('Process exiting with code:', code)
// })



require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION Shutting down...', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION Shutting down...', err);
  process.exit(1);
});