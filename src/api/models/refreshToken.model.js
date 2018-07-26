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

    RefreshToken.associate = function (models) {
        models.RefreshToken.belongsTo(models.User, {
            constraints: true,
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        })
    }

    return RefreshToken;
};