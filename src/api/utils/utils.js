const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const salt = 12;

exports.hashPassword = function (pwd) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(pwd, salt, (err, hashedPassword) => {
            if(err) { return reject(err); }
            resolve(hashedPassword);
        })
    })
};

exports.resWithSuccess = function (res, data = null, status = httpStatus.OK) {
    const successResponse = {
        timestamp: new Date().toUTCString(),
        success: true,
        status: status,
    };

    if (data) {
        successResponse.data = data;
    }

    res.status(status).send(successResponse)
};
