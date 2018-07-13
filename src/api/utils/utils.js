const bcrypt = require('bcrypt');

const salt = 12;

exports.hashPassword = function(pwd) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(pwd, salt, (err, hashedPassword) => {
            if(err) { return reject(err); }
            resolve(hashedPassword);
        })
    })
};
