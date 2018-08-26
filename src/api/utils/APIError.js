const httpStatus = require('http-status');

class APIError extends Error {
    constructor({
                    message,
                    status = httpStatus.INTERNAL_SERVER_ERROR,
                    errors = [],
                    stack = null
                }) {
        super(message);
        this.name = 'APIError';
        this.message = message;
        this.errors = errors.map((err) => {return { name: err.name, message: err.message }});
        this.status = status;
        stack ? this.stack = stack : Error.captureStackTrace(this, APIError)
    }

    static validationError(errors) {
        let err =  new APIError({
            message: errors.map(err => err.message).join('; '),
            status: httpStatus.BAD_REQUEST,
            errors: errors
        });
        err.details = [];
        return err;
    }
}

module.exports = APIError;