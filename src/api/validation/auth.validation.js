const Joi = require('joi');

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#?!@$%^&*-]?).{8,}$/;

module.exports = {
    login: {
        body: {
            user: Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().regex(passwordRegex).required()
            })
        }
    },
    register: {
        body: {
            user: Joi.object({
                username: Joi.string().regex(/^[a-z1-9]+$/).required(),
                email: Joi.string().email().required(),
                password: Joi.string().regex(passwordRegex).required()
            })
        },
    },
    refresh: {
        body: {
            refreshToken: Joi.string().required()
        }
    }
};