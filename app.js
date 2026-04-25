const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const bookingRouter = require('./routes/bookingRoutes.js');
const bookingController = require('./controllers/bookingController.js');
const reviewRouter = require('./routes/reviewRoutes.js');
const favouriteRouter = require('./routes/favouriteRoutes.js');
const viewRouter = require('./routes/viewRoutes.js');

const app = express();

// Trust only the first proxy hop (e.g., Render, Heroku, nginx)
// Do NOT set to `true` — express-rate-limit rejects it as too permissive
app.set('trust proxy', 1);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Global middleware
//Implement CORS
app.use(cors());
app.options('*', cors());

//Serve static files
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
          "'self'",
          'https:',
          'http:',
          'blob:',
          'https://*.mapbox.com',
          'https://*.cloudflare.com',
          'https://js.stripe.com',
          "'unsafe-inline'",
        ],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        workerSrc: ["'self'", 'data:', 'blob:', 'https://*.mapbox.com'],
        childSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://*.mapbox.com'],
        connectSrc: [
          "'self'",
          'http://127.0.0.1:3000',
          'http://localhost:3000',
          'https://cdnjs.cloudflare.com',
          'blob:',
          'wss:',
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
        ],
        upgradeInsecureRequests: [],
      },
    },
  }),
);

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
  message: 'Too many requests from this IP, please try again in an hour',
  validate: { trustProxy: true },
});
app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);

//Body parser, Reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Note: xss-clean has been removed as it is deprecated and unmaintained.
// Output encoding is handled by the Pug template engine and the xss-filters
// library can be used where manual sanitization is needed.

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

//Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/favourites', favouriteRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
