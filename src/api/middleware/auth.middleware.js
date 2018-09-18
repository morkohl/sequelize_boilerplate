const utils = require('../utils');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const config = require('../../config');

module.exports = function(options = config.security.jwt.accessToken) {
    return async function(req, res, next) {
        let error = {
            status: httpStatus.UNAUTHORIZED
        };

        const extractedAccessToken = await utils.extractToken(req, options);

        if (!extractedAccessToken) {
            error.message = 'Invalid access token header';
            return next(new APIError(error));
        }

        try {
            req.accessToken = await utils.verifyToken(extractedAccessToken, options);
        } catch (err) {
            error.message = err.message;
            return next(new APIError(error));
        }

        return next();
    }
};