const db = require('../models');
const httpStatus = require('http-status');
const utils = require('../utils');
const APIError = require('../utils/APIError');

exports.register = async function (req, res, next) {
    try {
        const foundUser = await db.User.find({
            where: {
                username: req.body.user.username,
                email: req.body.user.email
            }
        });

        if (foundUser) {
            next(new APIError({
                message: 'User already registered',
                status: httpStatus.UNPROCESSABLE_ENTITY
            }))
        }

        const newUser = await db.User.create(req.body.user);

        return utils.respondWithData(res, newUser, httpStatus.CREATED);
    } catch (err) {
        next(err);
    }
};

exports.login = async function (req, res, next) {
    let error = {
        status: httpStatus.UNAUTHORIZED
    };

    try {
        const user = await db.User.findOne(
            {
                where: {
                    email: req.body.user.email
                }
            });

        if (user) {
            const validPassword = await user.validPassword(req.body.user.password);

            if (validPassword) {
                const tokens = await db.RefreshToken.createTokenPair(user);
                return utils.respondWithData(res, tokens, httpStatus.CREATED);
            }

            error.message = "Invalid password";
            return next(new APIError(error));
        }
        error.message = "User doesn't exist";
        next(new APIError(error));
    } catch (err) {
        next(err);
    }
};

exports.logout = async function (req, res, next) {
    try {
        const user = await db.User.findById(req.accessTokenPayload.sub);
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

        if (refreshToken) {
            if(refreshToken.valid) {
                const user = await db.User.findById(refreshToken.userId);

                if (!user) {
                    next(new APIError({
                        message: 'Unknown user',
                        status: httpStatus.UNAUTHORIZED
                    }))
                }

                const refreshedAccessToken = await refreshToken.refreshAccessToken({sub: user.id});

                return utils.respondWithData(res, { accessToken: refreshedAccessToken }, httpStatus.CREATED);
            }

            next(new APIError({
                message: 'Invalid refresh token',
                status: httpStatus.UNAUTHORIZED
            }))
        }
        next(new APIError({
            message: 'Unknown refresh token',
            status: httpStatus.UNAUTHORIZED
        }))
    } catch (err) {
        next(err);
    }
};