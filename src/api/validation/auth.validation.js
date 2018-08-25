const Joi = require('joi');

const passwordRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#?!@$%^&*-]?).{8,}$"

module.exports = {
    login: {
        body: {
            user: {
                email: Joi.string().email().required().error("E-mail is not an e-mail"),
                password: Joi.string().regex(passwordRegex).required().error("Invalid password")
            }
        }
    },
    register: {
        body: {
            user: {
                username: Joi.string().regex("^[a-z1-9]+$").required().error("Special characters not allowed for usernames."),
                email: Joi.string().email().required().error("E-mail must be an email"),
                password: Joi.string().regex(passwordRegex).required().error("Invalid password")
            }
        }
    }
};