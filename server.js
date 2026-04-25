const dns = require('dns');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Node.js 20+ defaults to 'verbatim' DNS resolution (IPv6 first).
// MongoDB Atlas doesn't support IPv6, causing ECONNREFUSED on SRV lookups.
dns.setDefaultResultOrder('ipv4first');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception ⛔ shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Mongoose 8: Removed deprecated connection options (useNewUrlParser, useCreateIndex,
// useFindAndModify, useUnifiedTopology). These are now default behavior in Mongoose 8+.
mongoose
  .connect(DB)
  .then(() => {
    console.log('MongoDB connected successfully!');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection ⛔ shutting down...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED, Shutting down gracefully');
  server.close(() => {
    console.log('Process Terminated!');
  });
});
