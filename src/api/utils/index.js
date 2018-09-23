const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const salt = 12;
const APIError = require('./APIError');
const config = require('../../config');
const authConfig = config.security.jwt.accessToken
const randToken = require('rand-token');

exports.hashPassword = async function (user) {
    return user.password = await bcrypt.hash(user.password, salt);
};

//response utils
exports.respondWithData = function (res, data, status = httpStatus.OK) {
    const successResponse = {
        success: true,
        status: status,
        timestamp: new Date().getTime()
    };

    if (!data || data.length === 0) {
        throw new APIError({
            message: "Not found",
            status: httpStatus.NOT_FOUND
        })
    }

    successResponse.data = data;

    res.status(status).send(successResponse)
};

exports.respondSuccess = function (res, status = httpStatus.OK) {
    const successResponse = {
        success: true,
        status: status,
        timestamp: new Date().getTime()
    };

    res.status(status).send(successResponse);
};

//auth utils
exports.extractToken = async function (req, options = authConfig.extract) {
    const headerValue = req.headers[options.header.toLowerCase()];
    if(!headerValue) {
        return false;
    }
    const prefixAndToken = headerValue.trim().split(' ');
    const prefix= prefixAndToken[0];
    const token = prefixAndToken[1];
    return prefix && token && prefix === options.prefix && token;
};

exports.verifyToken = async function (token, secret = authConfig.secret, options = authConfig.verify) {
    return jwt.verify(token, secret, options);
};

exports.createJWT = async function (payload, secret = authConfig.secret, options = authConfig.sign) {
    return jwt.sign(payload, secret, options);
};

exports.setTokenHeader = function setToken(res, token, options = authConfig.extract) {
    return res.append(options.header, [options.prefix, token].join(' '));
};

exports.createRefreshToken = function(tokenLength = config.security.refreshToken.tokenLength) {
    return randToken.uid(tokenLength);
};