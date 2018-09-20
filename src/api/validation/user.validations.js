const Joi = require('joi');

module.exports = {
    change: {
        body: {
            user: Joi.object({
                email: Joi.string().email().required(),
                username: Joi.string().regex(/^[A-Za-z1-9]+$/i).required()
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