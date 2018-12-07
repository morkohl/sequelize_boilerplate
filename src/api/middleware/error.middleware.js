const Sequelize = require('sequelize');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const handler = function (err, req, res, next) {
    err = convertError(err);

    const errorResponse = {
        success: false,
        status: err.status,
        timestamp: new Date().getTime(),
        error: {
            message: err.message || httpStatus[err.status],
            errors: err.errors,
            stack: err.stack
        }
    };

    if (process.env.NODE_ENV === 'DEV' || process.env.NODE_ENV === 'TEST') {
        delete errorResponse.error.stack;
    }

    res.status(err.status).send(errorResponse);

    if (err.status >= 500) {
        console.error(err);
        process.exit(1);
    }
};

const convertError = function (err) {

    let convertedError = err;

    if (!(err instanceof APIError)) {
        convertedError = new APIError({
            message: err.message,
            errors: err.errors,
            stack: err.stack
        });
    }

    if(err.status && err.status instanceof Number) {
        convertedError.status = err.status;
    }

    if(err.stack.includes('Sequelize')) {
        convertedError.status = httpStatus.UNPROCESSABLE_ENTITY;
        delete convertedError.message
    }

    if(err instanceof SyntaxError) {
        convertedError.status = httpStatus.BAD_REQUEST
    }

    return convertedError;
};

exports.logError = function (err, req, res, next) {
    console.log('error occured;', {
        name: err.name,
        message: err.message,
    });
    next(err);
};

exports.notFound = function (req, res, next) {
    let err = new APIError({
        message: 'Not Found',
        status: httpStatus.NOT_FOUND
    });

    handler(err, req, res, next);
};

exports.handler = handler;
exports.convertError = convertError;

