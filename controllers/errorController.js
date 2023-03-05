const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid input ${err.path} ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  return new AppError(
    `Duplicate field value ${value} please use another value!`,
    400
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid Input data. ${errors.join('. ')}`, 400);
};

const handleJWTError = () => {
  return next(new AppError('Invalid token. Please login again!', 401));
};

const handleJWTExpiredError = () => {
  return next(
    new AppError('Your token has expired. Please Log in again!', 401)
  );
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR', err);

    res.status(500).json({
      status: 'error',
      message: 'Somthing want very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // mongoose cast error invalid path
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    // duplication error comes from mongodb driver
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    // mongoose validation error
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    // invaild jsonwebtoken error
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    // expired jsonwebtoken error
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }

  next();
};
