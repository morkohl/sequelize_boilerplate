const bcrypt = require('bcrypt');
const utils = require('../utils/utils');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING,
            }
        },
        {
            dialect: 'mysql',
            indexes: [
                {
                    name: 'user_email',
                    unique: true,
                    fields: ['email']
                },
                {
                    name: 'user_username',
                    unique: true,
                    fields: ['username']
                }

            ]
        });
    User.hook('beforeCreate', utils.hashPassword);
    User.hook('beforeUpdate', utils.hashPassword);

    User.prototype.validPassword = function (password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, this.password, (err, isMatch) => {
                if (err) {
                    return reject(err);
                }
                if (isMatch) {
                    return resolve(this);
                }
                resolve(false);
            })
        })
    };

    User.associate = function (models) {
        models.User.hasMany(models.Task)
    };


    return User;
};