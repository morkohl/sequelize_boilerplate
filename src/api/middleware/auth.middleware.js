const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const db = require('../models/db');
const APIError = require('../utils/APIError');
const {
    algorithms,
    jwtSecret,
    accessTokenDuration,
    refreshTokenDuration
} = require('../../config/config').authentication.jwt;


module.exports = async function authenticate(req, res, next) {
    const accessHeader = req.headers["x-access-token"];
    const refreshHeader = req.headers["x-refresh-token"];

    if (accessHeader && refreshHeader) {
        const accessToken = req.accessToken = accessHeader ; //accessHeader.split(' ')[1]
        const refreshToken = req.refreshToken = refreshHeader;

        let err = new APIError({
            message: "Forbidden",
            status: httpStatus.UNAUTHORIZED
        });

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

                    await db.RefreshToken.create({ token: newRefreshToken });

                    res.set({
                        'x-access-token': createNewToken(userId, accessTokenDuration),
                        'x-refresh-token': newRefreshToken
                    });

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