const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const handler = function (err, req, res, next) {
    const errorResponse = {
        status: err.status,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack
    };

    if (process.env.NODE_ENV !== 'development') {
        delete errorResponse.stack;
    }

    res.status(err.status).send(errorResponse);

    if (!err.isOperational) {
        console.error(err);
        process.exit(1);
    }
};

exports.handler = handler;

exports.converter = function (err, req, res, next) {
    let convertedError = err;


    if (!(err instanceof APIError)) {
        convertedError = new APIError({
            message: err.message,
            errors: err.errors,
            stack: err.stack
        });
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