module.exports = function (sequelize, DataTypes) {
    const Task = sequelize.define('task', {
        taskName: {
            type: DataTypes.STRING,
            validate: {
                notNull: {
                    args: true,
                    msg: "Please specify a task name",
                },
                notEmpty: {
                    args: true,
                    msg: "Please specify a task name"
                }
            }
        },
        maximumTaskPoints: {
            type: DataTypes.INTEGER,
            validate: {
                notNull: {
                    args: true,
                    msg: "Please specify maximum tasks points"
                },
                notEmpty: {
                    args: true,
                    msg: "Please specify maximum tasks points"
                }
            }
        },
        currentTaskPoints: {
            type: DataTypes.INTEGER,
            validate: {
                notNull: {
                    args: true,
                    msg: "Please specify maximum tasks points"
                },
                notEmpty: {
                    args: true,
                    msg: "Please specify maximum tasks points"
                }
            }
        },
        taskStatus: {
            type: DataTypes.ENUM,
            values: ['active', 'completed'],
            defaultValue: 'active'
        }
    });

    Task.association = function(models) {
        models.Task.belongsTo(models.User, {
            constraints: true,
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        })
    };

    Task.prototype.getCompletionPercentage = function() {
        return this.currentTaskPoints / this.maximumTaskPoints;
    };

    return Task;
};