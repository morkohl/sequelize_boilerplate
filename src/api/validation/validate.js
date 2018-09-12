const Joi = require('joi');
const APIError = require('../utils/APIError');

exports.validate = function (schema, options) {
    if(schema) {
        return function (req, res, next) {
            if(schema.body) {
                Joi.validate(req.body, schema.body, options, (err) => {
                    if(err) { next(APIError.validationError(err)); }
                })
            }
            if(schema.query) {
                Joi.validate(req.body, schema.body, options, (err) => {
                    if(err) { next(APIError.validationError(err)); }
                })
            }
            return next();
        }
    }
    throw new Error("No schema provided");
};