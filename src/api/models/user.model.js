const bcrypt = require('bcrypt');
const utils = require('../utils/index');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
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

            ],
        }
    );
    User.beforeCreate(utils.hashPassword);
    User.beforeUpdate(utils.hashPassword);


    User.associate = function (models) {
        models.User.hasMany(models.Task);
        models.User.hasMany(models.RefreshToken);
    };

    User.prototype.validPassword = function (password) {
        return bcrypt.compare(password, this.password);
    };


    return User;
};