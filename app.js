// const fs = require('fs');
const path = require('path');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { xss } = require('express-xss-sanitizer');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const corsOptions = {
  origin: [process.env.LOCAL_HOST_CLIENT],
  methods: 'GET,POST,PUT,PATCH,DELETE,HEAD',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: process.env.NODE_ENV === 'production' ? 86400 : 300,
};

app.use(cors(corsOptions));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global First middleware

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet()); // Apply all default Helmet protections first

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-eval'",
        'https://api.mapbox.com',
        'https://cdn.jsdelivr.net',
        'blob:',
      ],
      workerSrc: ["'self'", 'blob:'],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://api.mapbox.com',
        'https://fonts.googleapis.com',
        'https://cdn.jsdelivr.net',
      ],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net',
      ],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://*.mapbox.com'],
      connectSrc: [
        "'self'",
        'https://api.mapbox.com',
        'https://events.mapbox.com',
        'https://cdn.jsdelivr.net',
        'http://localhost:3000/v1/users/login',
        'ws://localhost:1234',
        'http://127.0.0.1:3000/api/v1/users/updateMe',
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  })
);

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// Urlencoded parser (e.g., data from HTML form element) from the client
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser, parsing of cookie from the client into req.cookies
app.use(cookieParser());

// Data sanitization against NoSql QUERY Injection
app.use(mongoSanitize());

// Data sanitization against xss attack
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingssQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  // console.log('Hello from the middleware 😀');
  // console.log(req.headers)
  // console.log(req.cookies);
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// ROUTES
app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
