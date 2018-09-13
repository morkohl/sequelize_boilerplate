const Joi = require('joi');

module.exports = {
    create: {
        body: {
            task: Joi.object({
                taskName: Joi.string().required(),
                maximumTaskPoints: Joi.number().min(0).max(50).required(),
                currentTaskPoints: Joi.number().min(0).max(50).required(),
                taskStatus: Joi.any().forbidden()
            })
        }
    },
    change: {
        body: {
            task: Joi.object({
                taskName: Joi.string(),
                maximumTaskPoints: Joi.number().min(0).max(50),
                currentTaskPoints: Joi.number().min(0).max(50),
                taskStatus: Joi.any().forbidden()

            })
        }
    }
};