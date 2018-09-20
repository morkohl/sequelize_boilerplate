const utils = require('../utils');

module.exports = function (sequelize, DataTypes) {
    const RefreshToken = sequelize.define('refreshToken', {
        token: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        valid: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    RefreshToken.prototype.refreshAccessToken = function (payload) {
        return utils.createJWT(payload);
    };

    RefreshToken.associate = function (models) {
        models.RefreshToken.belongsTo(models.User, {
            constraints: true,
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        })
    };

    RefreshToken.createTokenPair = async function (user) {
        const accessToken = await utils.createJWT({ sub: user.id });
        const refreshToken = utils.createRefreshToken();

        await RefreshToken.create({
            token: refreshToken,
            userId: user.id
        });

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        }
    };

    return RefreshToken;
};