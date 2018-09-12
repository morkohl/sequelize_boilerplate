const Joi = require('joi');

module.exports = {
    change: {
        body: {
            user: {
                email: Joi.string().email().required(),
                username: Joi.string().regex(/^[a-z1-9]+$/).required(),
            }
        }
    },
};