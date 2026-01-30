const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception ⛔ shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindandModify: false,
  })
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
