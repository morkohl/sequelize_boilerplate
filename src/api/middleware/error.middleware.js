const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const handler = function (err, req, res, next) {
    const errorResponse = {
        success: false,
        status: err.status,
        timestamp: new Date().toUTCString(),
        error: {
            message: err.message || httpStatus[err.status],
            errors: err.errors,
            stack: err.stack
        }
    };

    if (process.env.NODE_ENV !== 'DEV') {
        delete errorResponse.error.stack;
    }

    res.status(err.status).send(errorResponse);

    if (err.status >= 500) {
        console.error(err);
        //add log message
        process.exit(1);
    }
};

exports.converter = function (err, req, res, next) {
    let convertedError = err;

    if (!(err instanceof APIError)) {
        convertedError = new APIError({
            message: err.message,
            errors: err.errors,
            stack: err.stack
        });
    }

    //bodyparser errors
    if(err instanceof SyntaxError) {
        convertedError.status = httpStatus.BAD_REQUEST
    }

    if(err instanceof Sequelize.ValidationError) {
        convertedError.status = httpStatus.UNPROCESSABLE_ENTITY;
    }

    handler(convertedError, req, res)
};

exports.notFound = function (req, res, next) {
  let err = new APIError({
      message: 'Not Found',
      status: httpStatus.NOT_FOUND
  });

  handler(err, req, res);
};

exports.handler = handler;
