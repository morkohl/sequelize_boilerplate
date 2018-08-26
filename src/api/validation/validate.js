const Joi = require('joi');
const APIError = require('../utils/APIError');

exports.validate = function (schema) {

    if(schema) {
        return function(req, res, next) {
            let errors = [];
            if(schema.body) {
                Joi.validate(req.body, schema.body, (err) => {
                    if(err) { errors.push(err); }
                });
            }
            if (schema.query) {
                Joi.validate(req.query, schema.query, (err) => {
                    if(err) { errors.push(err); }
                });
            }

            if (errors.length !== 0) {
                next(APIError.validationError(errors))
            }

            next();
        }
    }
    throw new Error("No schema provided.");
};