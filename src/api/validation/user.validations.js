const Joi = require('joi');

module.exports = {
    change: {
        body: {
            user: {
                username: Joi.string().regex("^[a-z1-9]+$").required().error("Special characters not allowed for usernames."),
                email: Joi.string().email().required().error("E-mail must be an e-mail"),
            }
        }
    },
    get: {
        query: {
            id: Joi.number().integer().required()
        }
    }
};