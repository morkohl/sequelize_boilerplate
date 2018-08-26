const Joi = require('joi');

module.exports = {
    change: {
        body: {
            user: {
                username: Joi.string().regex(/^[a-z1-9]+$/).required(),
                email: Joi.string().email().required(),
            }
        }
    },
};