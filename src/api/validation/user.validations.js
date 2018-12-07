const Joi = require('joi');

module.exports = {
    update: {
        body: {
            user: Joi.object({
                email: Joi.string().email(),
                username: Joi.string().regex(/^[\w\-]+$/)
            }).required()
        },
        params: {
            userId: Joi.number().positive().required()
        }
    },
    userParams: {
        params: {
            userId: Joi.number().positive().required()
        }
    }
};