const Joi = require('joi');
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');

exports.validate = function (schema, options) {
    if(!options) {
        options = { abortEarly: false };
    }

    if(schema) {
        return function (req, res, next) {
            if(schema.body) {
                Joi.validate(req.body, schema.body, options, (err) => {
                    if(err) { next(apiValidationError(err)) }
                });
            }
            if(schema.query) {
                Joi.validate(req.body, schema.body, options, (err) => {
                    if(err) { next(apiValidationError(err)); }
                });
            }
            return next();
        }
    }
    throw new Error("No schema provided");
};

const apiValidationError = function(joiError) {
    return new APIError({
        message: joiError.name,
        status: httpStatus.BAD_REQUEST,
        errors: joiError.details.map(err => {
            return {
                name: "Validation Error",
                message: err.message
            }
        })
    });
};