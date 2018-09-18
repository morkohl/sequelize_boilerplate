const db = require('../models/db');
const httpStatus = require('http-status');
const utils = require('../utils');
const APIError = require('../utils/APIError');

exports.register = async function (req, res, next) {
    try {
        const result = db.User.findOrCreate({
            where: {
                username: req.body.user.username,
                email: req.body.user.email
            }
        });
        const user = result[0];
        const created = result[1];
        if (created) {
            return utils.respondWithData(res, user, httpStatus.CREATED);
        }
        next(new APIError({
            message: "User already registered"
        }));
    } catch (err) {
        next(err);
    }
};

exports.login = async function (req, res, next) {
    try {
        const user = await db.User.findOne(
            {
                where: {
                    username: req.body.user.username
                }
            });

        if (user && await user.validPassword(password)) {
            const tokens = await db.RefreshToken.createTokenPair(user);
            res = utils.setTokenHeader(res, tokens.accessToken);
            delete tokens.accessToken;
            return utils.respondWithData(res, tokens, httpStatus.CREATED);
        }

        next(new APIError({
            message: !validPassword ? "Invalid login" : "User doesn't exist",
            status: httpStatus.FORBIDDEN
        }))
    } catch (err) {
        next(err);
    }
};

exports.logout = async function (req, res, next) {
    try {
        const userId = req.accessToken.sub;
        const user = await db.User.findById(userId);
        if (user) {
            await db.RefreshToken.update(
                {
                    valid: false
                },
                {
                    where: {
                        userId: user.id
                    }
                });
            return utils.respondSuccess(res);
        }

        next(new APIError({
            message: "User doesn't exist",
            status: httpStatus.BAD_REQUEST
        }))
    } catch (err) {
        next(err);
    }
};

exports.refresh = async function (req, res, next) {
    try {
        const refreshToken = await db.RefreshToken.find({
            where: {
                token: req.body.refreshToken,
            }
        });


        if (!(refreshToken && refreshToken.valid)) {
            next(new APIError({
                message: refreshToken.valid ? 'Unknown refresh token' : 'Invalid refresh token',
                status: httpStatus.UNAUTHORIZED
            }))
        }

        const user = await db.User.findById(refreshToken.userId);

        if(!user) {
            next(new APIError({
                message: 'Unknown user',
                status: httpStatus.unauthorized
            }))
        }

        await db.RefreshToken.destroy({
            where: {
                token: req.body.refreshToken,
                userId: user.id
            }
        });

        const tokens = await refreshToken.createTokenPair(user);

        res = utils.setTokenHeader(res, tokens.accessToken);
        delete tokens.accessToken;
        return utils.respondWithData(res, tokens, httpStatus.CREATED);
    } catch (err) {
        next(err);
    }
};