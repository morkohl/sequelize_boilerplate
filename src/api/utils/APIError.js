const httpStatus = require('http-status');

class APIError extends Error {
    constructor({
                    message,
                    errors,
                    status = httpStatus.INTERNAL_SERVER_ERROR,
                    stack
                }) {
        super(message);
        this.name = 'APIError';
        this.message = message;
        this.errors = errors;
        this.status = status;
        this.isOperational = true;
        this.stack = stack;
    }
}

module.exports = APIError;