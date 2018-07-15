const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const handler = function (err, req, res, next) {
    const errorResponse = {
        success: false,
        status: err.status,
        error: {
            message: err.message || httpStatus[err.status],
            errors: err.errors,
            stack: err.stack
        }
    };

    if (process.env.NODE_ENV !== 'development') {
        delete errorResponse.errorstack;
    }

    errorResponse.timestamp = new Date().toUTCString();

    res.status(err.status).send(errorResponse);

    if (!err.isOperational) {
        console.error(err);
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

    //this is good but we also have to include some way of identifiying validation errors from joi!
    //one way to do it would be searching through all the keys of any schema and identifiying the key back in the stack
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
