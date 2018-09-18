const bcrypt = require('bcrypt');
const utils = require('../utils/index');

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
        return bcrypt.compare(password, this.password)
    };

    User.associate = function (models) {
        models.User.hasMany(models.Task);
        models.User.hasMany(models.RefreshToken);
    };

    return User;
};