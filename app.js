/**
 * This code is an Express application that provides a RESTful API for a fictional educational platform.
 */

/**
 * Imports the Express and helmet modules.
 *
 * @param {string} express The Express module.
 * @param {string} helmet The helmet module.
 */
 const express = require('express');
 const helmet = require('helmet');
 
 /**
  * Sets security HTTP headers.
  *
  * @param {object} headers The security HTTP headers.
  */
 app.use(helmet());
 
 /**
  * Development logging.
  *
  * @param {string} format The logging format.
  */
 if (process.env.NODE_ENV === 'development') app.use(morgan(format));
 
 /**
  * Limits requests from same API.
  *
  * @param {object} options The rate limiting options.
  */
 const limiter = rateLimit({
   windowMs: 60 * 60 * 1000,
   max: 100,
   message:
     'Too many accounts created from this IP, please try again after an hour',
 });
 
 app.use('/api', limiter);
 
 /**
  * Body parser, reading data from body into req.body.
  *
  * @param {object} options The body parser options.
  */
 app.use(express.json({ limit: '10kb' }));
 
 /**
  * Cookie parser.
  *
  * @param {object} options The cookie parser options.
  */
 app.use(cookieParser());
 
 /**
  * Data sanitization against NoSQL query injection.
  *
  * @param {object} options The data sanitization options.
  */
 app.use(mongoSanitize());
 
 /**
  * Data sanitization against XSS.
  *
  * @param {object} options The data sanitization options.
  */
 app.use(xss());
 
 /**
  * Prevent parameter pollution.
  *
  * @param {object} options The parameter pollution options.
  */
 app.use(
   hpp({
     whitelist: ['ratingsQuantity', 'ratingsAverage', 'level', 'price'],
   })
 );
 
 /**
  * Test middleware.
  *
  * @param {object} req The request object.
  * @param {object} res The response object.
  * @param {function} next The next function.
  */
 app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
 });
 
 /**
  * Route the requests to the appropriate controllers.
  *
  * @param {string} path The path.
  * @param {function} controller The controller function.
  */
 app.use('/api/v1/courses', courseRouter);
 app.use('/api/v1/users', userRouter);
 app.use('/api/v1/reviews', reviewRouter);
 app.use('/api/v1/uploads', uploadRouter);
 
 /**
  * Catch all other requests and return a 404 error.
  *
  * @param {object} req The request object.
  * @param {object} res The response object.
  * @param {function} next The next function.
  */
 app.all('*', (req, res, next) => {
   next(new AppError(`Can not found ${req.originalUrl} on this server!`, 404));
 });
 
 /**
  * Global error handler.
  *
  * @param {object} err The error object.
  */
 app.use(globalErrorHandler);
 
 /**
  * Export the app.
  *
  * @type {express.Application}
  */
 module.exports = app;