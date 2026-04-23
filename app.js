/* eslint-disable import/extensions */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const compression = require('compression');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const bookingRouter = require('./routes/bookingRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');
const viewRouter = require('./routes/viewRoutes.js');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Global middleware

//Service static files
app.use(express.static(path.join(__dirname, 'public')));
//Set security HTTP headers
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
//         baseUri: ["'self'"],
//         fontSrc: ["'self'", 'https:', 'data:'],
//         scriptSrc: [
//           "'self'",
//           'https:',
//           'http:',
//           'blob:',
//           'https://*.mapbox.com',
//           'https://*.cloudflare.com',
//           "'unsafe-inline'",
//         ],
//         frameSrc: ["'self'"],
//         objectSrc: ["'none'"],
//         styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
//         workerSrc: ["'self'", 'data:', 'blob:', 'https://*.mapbox.com'],
//         childSrc: ["'self'", 'blob:'],
//         imgSrc: ["'self'", 'data:', 'blob:', 'https://*.mapbox.com'],
//         connectSrc: [
//           "'self'",
//           'http://127.0.0.1:3000',
//           'http://localhost:3000',
//           'https://cdnjs.cloudflare.com',
//           'blob:',
//           'wss:',
//           'https://*.tiles.mapbox.com',
//           'https://api.mapbox.com',
//           'https://events.mapbox.com',
//         ],
//         upgradeInsecureRequests: [],
//       },
//     },
//   }),
// );

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const nodeEnv = process.env.NODE_ENV || 'development';
console.log(`Running in ${nodeEnv} mode`);

if (process.env.NODE_ENV === 'production') {
  // Production-specific code
  console.log('Production optimizations enabled');
}

//Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too may requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

//Body parser, Reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(compression());

//Test Middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // })
  // --------------------
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // ---------------------

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
