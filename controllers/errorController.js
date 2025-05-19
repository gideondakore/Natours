const AppError = require('./../utils/appError');
const getPrototypeChain = require('./../utils/getPrototypeChain');

const handleMongooseErrorDB = (err) => {
  let message;
  if (err.name === 'CastError') {
    message = `Invalid ${err.path}: ${err.value}.`;
  } else if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join('. ');
  } else {
    message = 'Oops! something unexpected happened. Please try again later';
  }
  return new AppError(message, 400);
};

const handleMongoErrorDB = (err) => {
  let message;
  const value = err.errorResponse.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  if (err.code === 11000) {
    message = `Duplicate field value: ${value}, Please use another value`;
  } else {
    message = 'Oops! something unexpected happened. Please try again later';
  }
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has been expired! Please log in again', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // B) RENDERED WEBSITE
  console.error('ERROR RENDERED WEBSITE DEV💥: ', err, ' : ', err.stack);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // a) Operational, trusted error: send message to clinet
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // b) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR Log error API 💥: ', err, ' : ', err.stack);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) RENDERED WEBSITE
  if (err.isOperational) {
    // a) Operational, trusted error: send message to clinet
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }

  // b) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR RENDERED WEBSITE PROD 💥:', err, ' : ', err.stack);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  console.log('Logging: ', err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  let error = Object.create(
    Object.getPrototypeOf(err),
    Object.getOwnPropertyDescriptors(err)
  );

  // error.stack = err.stack;
  error.message = err.message;

  if (typeof err === 'string' || typeof err === 'number') {
    // console.log('==========THIS SHOULD NOT RUN===============');
    error = {};
    error.statusCode = err.statusCode || 500;
    error.status = err.status || 'error';

    error.stack = err.stack;
    error.message = err;
    error.message = `${error.message} \n Error occur while handling the error delegated from higher middleware handler. NOTE: If you pass your custom error string to the next() function (except the string "route"), use the AppError() util class to format it in order to avoid future error. Check the stack trace to find it if possible. !!FIX THIS PLEASE!!`;
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (getPrototypeChain(error).includes('MongooseError'))
      error = handleMongooseErrorDB(error);

    if (getPrototypeChain(error).includes('MongoError'))
      error = handleMongoErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
