const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const salt = 12;
const APIError = require('./APIError');

exports.hashPassword = async function (user) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(user.password, salt, (err, hashedPassword) => {
            if(err) { return reject(err); }
            resolve(hashedPassword);
        })
    })
};

exports.respondWithData = function (res, data, status = httpStatus.OK) {
    const successResponse = {
        success: true,
        status: status,
        timestamp: new Date().toUTCString()
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
        timestamp: new Date().toUTCString()
    };

    res.status(status).send(successResponse);
};