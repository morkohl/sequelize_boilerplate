const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const db = require('../models/db');
const APIError = require('../utils/APIError');
const {
    algorithms,
    jwtSecret,
    accessTokenDuration,
    refreshTokenDuration
} = require('../../config/config').security.jwt;

//rework with nested functions.. look at express-validation code!
//add multiple device support
module.exports = async function authenticate(req, res, next) {
    const accessHeader = req.headers["x-access-token"];
    const refreshHeader = req.headers["x-refresh-token"];

    let err = new APIError({
        message: "Forbidden",
        status: httpStatus.UNAUTHORIZED
    });

    if (accessHeader && refreshHeader) {
        const accessToken = req.accessToken = accessHeader ; //accessHeader.split(' ')[1]
        const refreshToken = req.refreshToken = refreshHeader;

        let userId;

        try {
            const accessTokenResult = await verifyToken(accessToken);

            if (!accessTokenResult) {
                const refreshTokenResult = await verifyToken(refreshToken);

                if (!refreshTokenResult) {
                    const persistedRefreshToken = await db.RefreshToken.findOne({
                        where: {
                            token: req.refreshToken
                        }
                    });

                    userId = persistedRefreshToken.userId;

                    if (!persistedRefreshToken.valid) {
                        return next(err);
                    }

                    const newRefreshToken = createNewToken(userId, refreshTokenDuration);

                    setTokens(res)

                } else {
                    userId = refreshTokenResult.data.userId;

                    res.set({
                        'x-access-token': createNewToken(userId)
                    });

                }
            } else {
                userId = accessTokenResult.data.userId;
            }

            req.locals.user = await db.User.findById(userId);
            return next();
        } catch(err) {
            next(err);
        }

    } else {
        return next(err);
    }
};

const verifyToken = async function(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, algorithms, async (err, payload) => {
            if (err instanceof jwt.TokenExpiredError) { resolve(false); }
            else if (err) { reject(err); }
            else { resolve(payload)}
        })
    })
};

const createNewToken = function (userId, expiresIn) {
    const payload = { data: { userId: userId }};
    return jwt.sign(payload, jwtSecret, expiresIn);
};

const persistRefreshToken = function (user, refreshToken) {
    return db.RefreshToken.create({
        token: refreshToken,
        userId: user.id
    })
};

const setTokens = async function (res, user) {
    const refreshToken = createNewToken(user.id, refreshTokenDuration);
    await persistRefreshToken(user, refreshToken);
    return res.set({
        'x-access-token': createNewToken(user.id, accessTokenDuration),
        'x-refresh-token': refreshToken
    });
};

exports.setTokens = setTokens;