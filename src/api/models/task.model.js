const STATUSES = {
    active: 'active',
    completed: 'completed'
};

module.exports = function (sequelize, DataTypes) {
    const Task = sequelize.define('task', {
        taskName: {
            type: DataTypes.STRING,
        },
        maximumTaskPoints: {
            type: DataTypes.INTEGER,
        },
        currentTaskPoints: {
            type: DataTypes.INTEGER,
            validate: {
                isBelowMax: function (value, next) {
                    if (value > this.maximumTaskPoints) {
                        return next('Current task points need to be less than maximum task points.')
                    }
                    next();
                },
            }
        },
        taskStatus: {
            type: DataTypes.ENUM,
            values: Object.keys(STATUSES).map(key => STATUSES[key]),
            defaultValue: STATUSES.active
        }
    });

    Task.associate = function(models) {
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

    Task.beforeCreate(getStatus);
    Task.beforeUpdate(getStatus);

    return Task;
};

const getStatus = function(task) {
    return task.currentTaskPoints < task.maximumTaskPoints ? STATUSES.active : STATUSES.completed;
};