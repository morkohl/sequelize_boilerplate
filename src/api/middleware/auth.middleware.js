const utils = require('../utils');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const authConfig = require('../../config').security.jwt.accessToken;

module.exports = function(options = authConfig) {
    return async function(req, res, next) {
        let error = {
            status: httpStatus.UNAUTHORIZED
        };

        const extractedAccessToken = await utils.extractToken(req, options.extract);

        if (!extractedAccessToken) {
            error.message = 'Invalid access token header';
            return next(new APIError(error));
        }

        try {
            req.accessTokenPayload = await utils.verifyToken(extractedAccessToken, options.secret, options.verify);
        } catch (err) {
            error.message = err.message;
            return next(new APIError(error));
        }

        return next();
    }
};