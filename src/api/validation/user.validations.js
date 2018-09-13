const Joi = require('joi');

module.exports = {
    change: {
        body: {
            user: Joi.object({
                email: Joi.string().email().required(),
                username: Joi.string().regex(/^[a-z1-9]+$/).required()
            }).required()
        },
        params: {
            userId: Joi.number().required()
        }
    },
    userParams: {
        params: {
            userId: Joi.number().required()
        }
    }
};