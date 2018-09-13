const db = require('../models/db');
const httpStatus = require('http-status');
const respondSuccess = require('../utils/utils').respondSuccess;
const APIError = require('../utils/APIError');
const auth = require('../middleware/auth.middleware.deprecated');

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
            return respondWithData(res, user, httpStatus.CREATED);
        }
        next(new APIError({
            message: "User already registered"
        }));
    } catch (err) {
        next(err);
    }
};

//try to permit this somehow
exports.login = async function (req, res, next) {
    try {
        const user = await db.User.findOne(
            {
                where: {
                    username: req.body.user.username
                }
            });
        if (user) {
            const validPassword = await user.validPassword(req.body.user.password);
            if (validPassword) {
                await auth.setTokens(res, user);
                return respondSuccess(res);
            }
        }
        next(new APIError({
            message: !validPassword ? "Invalid login" : "User doesn't exist",
            status: httpStatus.UNAUTHORIZED
        }))
    } catch (err) {
        next(err);
    }
};

//invalidate any refresh tokens. client throws away accesstoken
exports.logout = async function (req, res, next) {
    try {
        const userId = req.params.userId;
        const user = await db.User.findById(userId);
        if (user) {
            await db.RefreshToken.update(
                {
                    where: {
                        userId: user.id
                    }
                },
                {
                    valid: 0
                });
            return respondSuccess(res);
        }

        next(new APIError({
            message: "User doesn't exist",
            status: httpStatus.BAD_REQUEST
        }))
    } catch (err) {
        next(err);
    }
};